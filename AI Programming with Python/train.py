"""
Trains a new network on a dataset and saves the model as a checkpoint.
"""
import argparse
import numpy as np
import time
import json

import torch
from torch import nn
from torch import optim
import torch.nn.functional as F
from torchvision import datasets, transforms, models
      
class Network(nn.Module):
    def __init__(self, input_size, output_size, hidden_units, drop_probability=0.5):
        
        """
        Build a feedforward network.
        
        input_size: integer, size of the input
        output_size: integer, size of the output layer
        hidden_layers: list of integers, the sizes of the hidden layers
        drop_probability: float between 0 and 1
        """
        super().__init__()
        # Add the first layer, input to a hidden layer
        
        self.input_size = input_size
        self.output_size = output_size
        self.drop_probability = drop_probability
        
        #Ensures hidden units are in a list (i.e. if one hidden unit is specified.
        if type(hidden_units) != list: self.hidden_units = [hidden_units]
        else: self.hidden_units = hidden_units
        
        self.hidden_layers = nn.ModuleList([nn.Linear(self.input_size, self.hidden_units[0])])
        
        # Add a variable number of more hidden layers
        self.layer_sizes = zip(self.hidden_units[:-1], self.hidden_units[1:])
        self.hidden_layers.extend([nn.Linear(h1, h2) for h1, h2 in self.layer_sizes])

        self.output = nn.Linear(self.hidden_units[-1], self.output_size)  
        self.dropout = nn.Dropout(p=self.drop_probability)
        
    def forward(self, x):
        """
        Forward pass, return logits.
        """
        
        # Forward through each layer in `hidden_layers`, with ReLU activation and dropout
        for linear in self.hidden_layers:
            x = F.relu(linear(x))
            x = self.dropout(x)
        
        x = self.output(x)
        
        return F.log_softmax(x, dim=1)

def validation(model, testloader, criterion):
    test_loss, accuracy = 0, 0

    for images, labels in testloader:

        images, labels = images.to(device), labels.to(device)
        images.unsqueeze(0)

        output = model.forward(images)
        test_loss += criterion(output, labels).item()

        ps = torch.exp(output)
        equality = (labels.data == ps.max(dim=1)[1])
        accuracy += equality.type(torch.FloatTensor).mean()
    
    return test_loss, accuracy

def deep_learn(model, criterion, optimizer, trainloader, epochs, device, print_every, testloader):
    
    "Deep learning with back propagation."
    
    steps = 0
    
    for e in range(epochs):
    
        model.train()
        
        running_loss = 0
        
        for i, (inputs, labels) in enumerate(trainloader):
            
            steps += 1
            
            inputs = inputs.to(device)
            labels = labels.to(device)
         
            inputs.unsqueeze(0)
            optimizer.zero_grad()
            

            outputs = model.forward(inputs)
            loss = criterion(outputs,labels)
            loss.backward()
            optimizer.step() 
            
            running_loss += loss.item()

            if steps % print_every == 0:
                
                # network in eval mode for inference
                model.eval()
                
                # turn off gradients for validation, to save memory
                with torch.no_grad():
                    test_loss, accuracy = validation(model, testloader, criterion)
                    
                print("Epoch: {}/{}.. ".format(e+1, epochs),
                      "Training Loss: {:.3f}.. ".format(running_loss/print_every),
                      "Test Loss: {:.3f}.. ".format(test_loss/len(testloader)),
                      "Test Accuracy: {:.3f}".format(accuracy/len(testloader)))

                running_loss = 0 
                
                model.train()
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Accepts arguments for image processing.")
    parser.add_argument('data_directory', type=str, help='the full path to the directory containing all data')
    parser.add_argument('--save_dir', type=str, default = False, help='The full path to the directory where the checkpoint will be saved. If left blank model will not be saved.')
    parser.add_argument('--arch', type=str, default='vgg16',choices=('vgg16', 'resnet18','alexnet'), help='choose the model architecture')
    parser.add_argument('--learning_rate', type=float, default=0.001, help='choose the learning rate (i.e. 0.003)')
    parser.add_argument('--hidden_units', nargs='+',type=int, default=4096, help='choose the number of hidden units; multiple hidden units supported.')
    parser.add_argument('--epochs', type=int, default=3, help='choose the number of epochs')
    parser.add_argument('--gpu', help = 'specify cpu or cuda', default='cuda', choices=['cpu', 'cuda'])
    arguments = parser.parse_args()
    
    #data_dir = arguments.data_directory + '/flowers'
    train_dir = arguments.data_directory + '/train'
    valid_dir = arguments.data_directory + '/valid'
    test_dir = arguments.data_directory + '/test'

    if arguments.gpu == 'cpu': device = torch.device('cpu')
    else: device = torch.device('cuda' if torch.cuda.is_available() else 'cpu') 

    # DONE: Define your transforms for the training, validation, and testing sets
    train_transform = transforms.Compose(
                          [transforms.RandomRotation(30),
                           transforms.RandomResizedCrop(224),
                           transforms.RandomHorizontalFlip(),
                           transforms.ToTensor(),
                           transforms.Normalize([0.485, 0.456, 0.406],[0.229, 0.224, 0.225])])

    # Used for both testing and validation
    test_valid_transform = transforms.Compose(
                          [transforms.Resize(256),
                           transforms.CenterCrop(224),
                           transforms.ToTensor(),
                           transforms.Normalize([0.485, 0.456, 0.406],[0.229, 0.224, 0.225])])

    # DONE: Load the datasets with ImageFolder
    train_dataset_0 = datasets.ImageFolder(train_dir, transform=train_transform) 
    valid_dataset_0 = datasets.ImageFolder(valid_dir, transform=test_valid_transform)
    test_dataset_0 = datasets.ImageFolder(test_dir, transform=test_valid_transform)

    # DONE: Using the image datasets and the trainforms, define the dataloaders (trainloaders)
    train_dataset = torch.utils.data.DataLoader(train_dataset_0, batch_size=64, shuffle=True)
    valid_dataset = torch.utils.data.DataLoader(valid_dataset_0, batch_size=32)
    test_dataset = torch.utils.data.DataLoader(test_dataset_0, batch_size=32)

    # DONE: Build and train your network
    model_choices = {'alexnet':  models.alexnet(pretrained=True),
                     'vgg16':    models.vgg16(pretrained=True)} 

    # Load a pre-trained network (VGG)
    model = model_choices[arguments.arch]

    # Define a new, untrained feed-forward network as a classifier, using ReLU activations and dropout
    model.classifier = Network(25088, 102, arguments.hidden_units, 0.5)

    criterion = torch.nn.NLLLoss()
    optimizer = torch.optim.Adam(model.classifier.parameters(), lr = arguments.learning_rate)

    # Train the classifier layers using backpropagation using the pre-trained network to get the features
    # Track the loss and accuracy on the validation set to determine the best hyperparameters
    
    print("Using", device)
    model.to(device)
    deep_learn(model, criterion, optimizer, train_dataset, arguments.epochs, device, 40, valid_dataset)

    # DONE: Do validation on the test set
    # turn off gradients for validation, to save memory
    model.eval()

    with torch.no_grad():
        test_loss, accuracy = validation(model, test_dataset, criterion)

    print("Test Loss: {:.3f}.. ".format(test_loss/len(test_dataset)),
          "Test Accuracy: {:.3f}".format(accuracy/len(test_dataset)))

    model.train()

    # DONE: Save the checkpoint 
    model.class_to_idx = train_dataset_0.class_to_idx
    checkpoint = {'class_to_idx' : model.class_to_idx,'classifier': model.classifier, 'state_dict': model.state_dict()}

    if arguments.save_dir: torch.save(checkpoint, arguments.save_dir + '/checkpoint.pth')