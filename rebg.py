from rembg import remove
from PIL import Image

input_path = 'tee.png'
output_path = 'output_image.png'

input_image = Image.open(input_path)

output_image = remove(input_image)

output_image.save(output_path)

print("การลบพื้นหลังเสร็จสิ้น")
