import tensorflow as tf
import tensorflow_io as tfio

def load_idx_data(image_path, label_path):
    images = tf.io.read_file(image_path)
    images = tf.io.decode_compressed(images, compression_type='')
    images = tf.io.decode_idx(images)
    images = tf.cast(images, tf.float32) / 255.0

    labels = tf.io.read_file(label_path)
    labels = tf.io.decode_compressed(labels, compression_type='')
    labels = tf.io.decode_idx(labels)

    return images, labels

def main():
  train_images_path = "gs://cloudapp-ai-assigment-3/train-images-idx3-ubyte"
  train_labels_path = "gs://cloudapp-ai-assigment-3/train-labels-idx1-ubyte"

  train_images, train_labels = load_idx_data(train_images_path, train_labels_path)

  model = tf.keras.Sequential([
      tf.keras.layers.Flatten(input_shape=(28, 28)),
      tf.keras.layers.Dense(128, activation='relu'),
      tf.keras.layers.Dense(10)
  ])

  model.compile(optimizer='adam',
                loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                metrics=['accuracy'])

  model.fit(train_images, train_labels, epochs=10)

  model.save('gs://cloudapp-ai-assignment-3/ai/my_model')


if __name__ == '__main__':
  main()


# gcloud ai custom-jobs create --region=asia-east1 --display-name=ml-job --python-package-uris=gs://cloudapp-ai-assigment-3/ai/train.py --python-module=train --container-image-uri=gcr.io/cloud-aiplatform/training/tf-cpu.2-4:latest