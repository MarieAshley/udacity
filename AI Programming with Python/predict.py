import numpy as np
import json
import argparse

import torch
from train import Network
from torchvision import models

# DONE: Write a function that loads a checkpoint and rebuilds the model
def load_checkpoint(filepath):
    checkpoint = torch.load(filepath)
    model = models.vgg16(pretrained=True)
    for parameter in model.parameters(): parameter.require_grad = False
    model.class_idx = checkpoint['class_to_idx']
    model.classifier = checkpoint['classifier']
    model.load_state_dict(checkpoint['state_dict'])
    
    return model

def process_image(image):
    ''' Scales, crops, and normalizes a PIL image for a PyTorch model,
        returns an Numpy array
    '''
    
    # DONE: Process a PIL image for use in a PyTorch model
    from PIL import Image
    im = Image.open(image)
    # Resizes the images so that the shortest side is 256 pixels, keeping the aspect ratio.
    shortest_side_index = im.size.index(min(im.size))
    longest_side_index = im.size.index(max(im.size))
    aspect_ratio = (im.size[0]/im.size[1])
    new_size = list(im.size)
    new_size[shortest_side_index] = 256
    new_size[longest_side_index] = int(256*aspect_ratio)
    im = im.resize(tuple(new_size))
    # Crop out center 224 x 224 of the image
    width_center = im.size[0]/2.0
    height_center = im.size[1]/2.0
    distance = 224/2.0
    im = im.crop((width_center - distance, height_center - distance, 
                  width_center + distance, height_center + distance))
    # Convert color channels of 0 - 255 to floats 0 - 1
    im = np.array(im)
    im = im/255.0
    
    #normalizes images
    means = [0.485, 0.456, 0.406]
    stds = [0.229, 0.224, 0.225]
    im = (im - means)/stds
    im = np.transpose(im, (2,0,1))
    
    return im

def predict(image_path, model, topk=3):
    ''' Predict the class (or classes) of an image using a trained deep learning model.
    '''
    
    # DONE: Implement the code to predict the class from an image file
    model.eval()
    im = process_image(image_path)
    torch_img = torch.from_numpy(im)
    torch_img = torch_img.unsqueeze(0)
    torch_img = torch_img.float()
    
    model = model.to(device)
    torch_img = torch_img.to(device)
    output = model.forward(torch_img)
    
    # find K most probable classes
    probs, classes = torch.exp(output).topk(topk)
    probs = probs.detach().cpu().numpy()[0]
    classes = classes.detach().cpu().numpy()[0]
    return probs, classes

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Accepts arguments for image processing.")
    parser.add_argument('image_path', type=str, help='the full path of the image file')
    parser.add_argument('trained_model', type=str, help='the full path to the checkpoint')
    parser.add_argument('--top_k', type=int, default=3, help='Choose how many classes to display')
    parser.add_argument('--category_names', type=str, default = False, help='Choose path to category names files.')
    parser.add_argument('--gpu', help = 'specify cpu or cuda', default='cuda', choices=['cpu', 'cuda'])
    arguments = parser.parse_args()
    
    if arguments.gpu == 'cpu': device = torch.device('cpu')
    else: device = torch.device('cuda' if torch.cuda.is_available() else 'cpu') 

    model = load_checkpoint(arguments.trained_model)
    probs, classes = predict(arguments.image_path, model, arguments.top_k)

    if arguments.category_names:
        with open(arguments.category_names, 'r') as f:
            cat_to_name = json.load(f)
            
        classes = [cat_to_name[str(x+1)] for x in classes]
    
    for p, c in zip(probs,classes): print(c, " with probability of ", p)
