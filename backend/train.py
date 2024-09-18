import pickle
import matplotlib.pyplot as plt
import numpy as np


import torch
from torch import nn, optim
from torchvision import datasets, transforms

import zipfile

import shutil
import os
import pandas as pd

root = 'train'
img_list = os.listdir(root)
print(len(img_list))

df = pd.read_csv(root+"/_classes.csv")
df.columns = df.columns.str.strip()
df.columns = df.columns.str.lower()
df = df[['filename','brazil', 'canada', 'finland', 'japan', 'united-kingdom', 'united_states', 'unlabeled']]
print(df)

s0 = 0
s1 = 0
s2 = 0
s3 = 0
s4 = 0
s5 = 0


# for i, (_, i_row) in enumerate(df.iterrows()):
#   try:
#       if i_row['brazil'] == 1:
#         s0 += 1
#         shutil.copyfile('train/' + i_row['filename'], 'data/Brazil/' + i_row['filename'])
    
#       elif i_row['canada'] == 1:
#         s1 += 1
#         shutil.copyfile('train/' + i_row['filename'], 'data/Canada/' + i_row['filename'])
        
#       elif i_row['finland'] == 1:
#         s2 += 1
#         shutil.copyfile('train/' + i_row['filename'], 'data/Finland/' + i_row['filename'])
        
#       elif i_row['japan'] == 1:
#         s3 += 1
#         shutil.copyfile('train/' + i_row['filename'], 'data/Japan/' + i_row['filename'])
        
#       elif i_row['united_states'] == 1:
#         s4 += 1
#         shutil.copyfile('train/' + i_row['filename'], 'data/United_States/' + i_row['filename'])
        
#       elif i_row['united-kingdom'] == 1:
#         s5 += 1
#         shutil.copyfile('train/' + i_row['filename'], 'data/United-Kingdom/' + i_row['filename'])
    
#   except Exception as e:
#         print(f"Error copying file: {e}")

img_list = os.listdir('data/Brazil')
img_list.extend(os.listdir('data/Canada'))
img_list.extend(os.listdir('data/Finland'))
img_list.extend(os.listdir('data/Japan'))
img_list.extend(os.listdir('data/United_States'))
img_list.extend(os.listdir('data/United-Kingdom'))

print("Images:", len(img_list))

device = ("cuda" if torch.cuda.is_available() else "cpu")

class AlexNet(nn.Module):

    def __init__(self, num_classes: int = 6):
        super(AlexNet, self).__init__()

        self.convolutional = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(64, 192, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(192, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
        )

        self.avgpool = nn.AdaptiveAvgPool2d((6, 6))

        self.linear = nn.Sequential(
            nn.Dropout(),
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:

        x = self.convolutional(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.linear(x)
        return torch.softmax(x, 1)
    
model = AlexNet()
model = model.to(device)

transform = transforms.Compose([
  transforms.Resize((64,64)),
  transforms.ToTensor()
])

country_data = datasets.ImageFolder('data', transform=transform)

# print(len(country_data))


batch_size = 64
trainLoader = torch.utils.data.DataLoader(country_data, batch_size=batch_size, shuffle=True)

optimizer = optim.Adam(model.parameters(), lr=0.0001)
criterion = nn.CrossEntropyLoss()

epochs = 10
train_loss = []

for epoch in range(epochs):
   
    total_train_loss = 0
    total_images_processed = 0
    
    # training our model
    for idx, (image, label) in enumerate(trainLoader):
        image, label = image.to(device), label.to(device)

        optimizer.zero_grad()
        pred = model(image)

        loss = criterion(pred, label)
        total_train_loss += loss.item()

        loss.backward()
        optimizer.step()

        total_images_processed += image.size(0)

    total_train_loss = total_train_loss / (idx + 1)
    train_loss.append(total_train_loss)

    print(f'Epoch: {epoch} | Train Loss: {total_train_loss} | Images Processed: {total_images_processed}')
    
# Save the trained model
model_path = 'alexnet_model.pkl'
torch.save({
    'epoch': epochs,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'train_loss': train_loss
}, model_path)

# Save the class names for later reference
class_names_path = 'class_names.pkl'
with open(class_names_path, 'wb') as f:
    pickle.dump(country_data.classes, f)

print("Model training success.")