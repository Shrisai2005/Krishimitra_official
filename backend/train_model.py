import torch
import torchvision
from torchvision import transforms, datasets
from torch import nn, optim
from tqdm import tqdm

# 📁 Dataset path
data_dir = "dataset"

# 🔄 Transform (important for accuracy)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])

# 📦 Load dataset
dataset = datasets.ImageFolder(data_dir, transform=transform)

# Save class names
with open("classes.txt", "w") as f:
    for cls in dataset.classes:
        f.write(cls + "\n")

# 🔀 Split
train_size = int(0.8 * len(dataset))
test_size = len(dataset) - train_size
train_data, test_data = torch.utils.data.random_split(dataset, [train_size, test_size])

train_loader = torch.utils.data.DataLoader(train_data, batch_size=32, shuffle=True)
test_loader = torch.utils.data.DataLoader(test_data, batch_size=32)

# 🧠 Model
model = torchvision.models.resnet18(weights="IMAGENET1K_V1")
model.fc = nn.Linear(model.fc.in_features, len(dataset.classes))

# ⚙️ Training setup
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 🚀 TRAIN
epochs = 5

for epoch in range(epochs):
    model.train()
    total_loss = 0

    for images, labels in tqdm(train_loader):
        images, labels = images.to(device), labels.to(device)

        outputs = model(images)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss:.4f}")

# 💾 Save model
torch.save(model.state_dict(), "plant_model.pth")

print("✅ Model trained successfully!")