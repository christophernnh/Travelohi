from flask import Flask, render_template, request, jsonify
from PIL import Image
import torch
from torchvision import transforms
from torch import nn
import pickle
from flask_cors import CORS 

api = Flask(__name__)
CORS(api)

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
model_path = 'alexnet_model.pkl'
checkpoint = torch.load(model_path)
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

class_names_path = 'class_names.pkl'
with open(class_names_path, 'rb') as f:
    class_names = pickle.load(f)

transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
])

@api.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        image_file = request.files['image']
        image = Image.open(image_file)

        image = transform(image)
        image = image.unsqueeze(0)

        with torch.no_grad():
            output = model(image)
            _, predicted_class = torch.max(output, 1)
            prediction = class_names[predicted_class.item()]

        return jsonify({'prediction': prediction})

if __name__ == '__main__':
    api.run(debug=True)
