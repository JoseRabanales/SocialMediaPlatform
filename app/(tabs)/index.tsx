import { Image, StyleSheet, Platform, View, Text } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Video } from "expo-av";

export interface FileData {
  name: string;
  type: string;
  uri: string;
}

export default function HomeScreen() {
  const [fileName, setFileName] = useState<string | null>();
  const [filePreview, setFilePreview] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadFileToServer = async (fileData: FileData): Promise<void> => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", {
      name: fileData.name,
      type: fileData.type,
      uri:
        Platform.OS === "ios"
          ? fileData.uri.replace("file://", "")
          : fileData.uri,
    });

    try {
      const response = await fetch(
        "https://stirred-prawn-main.ngrok-free.app/upload/",
        {
          method: "POST",
          headers: {
            // In TypeScript, it's better to not set Content-Type manually when dealing with multipart/form-data,
            // as the browser will set it along with the proper boundary parameter.
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      console.log("response------>", response);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseJson = await response.json();
      setUploading(false);
      console.log("Upload successful");
    } catch (error) {
      setUploading(false);
      console.error(
        "Upload failed",
        error instanceof Error ? error.message : error
      );
    }
  };

  // A simple functional component to render the preview based on file type
  const FilePreview = ({ fileData }: { fileData: FileData | null }) => {
    if (!fileData) return <Text>No file has been selected.</Text>;

    // Check file type to decide whether to render as image or video
    if (fileData.type.startsWith("image/")) {
      return <Image source={{ uri: fileData.uri }} style={styles.preview} />;
    }

    if (fileData.type.startsWith("video/")) {
      return <Video source={{ uri: fileData.uri }} style={styles.preview} />; // Assuming Video is a component for rendering videos
    }

    // Add more conditions if there are more types to support
    return <Text>Unable to preview file type.</Text>;
  };

  const handleFileUpload = () => {
    DocumentPicker.getDocumentAsync({
      multiple: false,
      type: "*/*", // or specify a specific mime type
    })
      .then((res) => {
        // Handle the case where the user cancels the document picker.
        if (res.canceled == true) {
          console.log("User canceled the document picker.");
          return;
        }

        console.log("Picked file:", res);

        const pickedFileData: FileData = {
          name: res.assets?.[0].name, // Make sure 'name' exists on the result
          type: res.assets?.[0].mimeType || "application/octet-stream", // Use a default MIME type if mimeType is not available
          uri: res.assets?.[0].uri,
        };

        setFileName(pickedFileData.name); // Update state with the file name
        setFilePreview(pickedFileData); // Setting the file data for preview
        // Now upload the file using this data
      })
      .catch((err) => {
        console.log("Upload Error-----> ", err);
      });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/bg-1.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>At this screen, you can uplaod media files.</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <Button title="Select" onPress={() => handleFileUpload()} />
        <Button
          title="Post"
          disabled={fileName != null ? false : true}
          onPress={() => filePreview && uploadFileToServer(filePreview)}
        />
      </View>
      {uploading && (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText type="defaultSemiBold">Uploading...</ThemedText>
        </View>
      )}
      {!uploading && fileName && (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText type="defaultSemiBold">
            Uploaded File: {fileName}
          </ThemedText>
          <FilePreview fileData={filePreview} />
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 200,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  preview: {
    width: "100%",
    height: 300, // Set any suitable height based on your layout
    resizeMode: "contain", // For images, maintain aspect ratio
  },
  button: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row", // Lays out children in a horizontal line.
    justifyContent: "space-around", // Distributes children evenly across container.
  },
});
