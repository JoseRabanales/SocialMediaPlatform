import Ionicons from "@expo/vector-icons/AntDesign";
import { Image, StyleSheet, Platform, View, Text } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FileData } from ".";
import { Video } from "expo-av";

import { Modal, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  fileUri: string;
  name: string;
  likes: number;
  disLikes: number;
  createdAt: Date;
  views: number;
  type: string;
}

// const fileData: Item[] = [
//   {
//     id: 1
//     fileUri: "https://stirred-prawn-main.ngrok-free.app/files/3",
//     name: "Image",
//     likes: 2,
//     disLikes: 3,
//     createdAt: new Date(),
//     views: 6,
//     type: "image/",
//   },
//   {
//     item: 2,
//     fileUri:
//       "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/2a0f6f50-71ad-440b-8917-ade05369b9bd.mp4",
//     name: "Video",
//     likes: 1,
//     disLikes: 2,
//     createdAt: new Date(),
//     views: 3,
//     type: "video/",
//   },
// ];

export default function TabTwoScreen() {
  const [fetching, setFetching] = useState<boolean>(false);
  const [fileData, setFileData] = useState<Item[] | []>([]);
  // A simple functional component to render the preview based on file type
  const FilePreview = ({ fileData }: { fileData: FileData }) => {
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

  const FileView = ({ fileData }: { fileData: FileData | null }) => {
    console.log("Received Files ------->", fileData);
    if (!fileData) return <Text>No file has been selected.</Text>;

    // Check file type to decide whether to render as image or video
    if (fileData.type.startsWith("image/")) {
      return <Image source={{ uri: fileData.uri }} style={styles.view} />;
    }

    if (fileData.type.startsWith("video/")) {
      return (
        <Video
          source={{ uri: fileData.uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          shouldPlay={true}
          useNativeControls={true}
          style={styles.view}
        />
      ); // Assuming Video is a component for rendering videos
    }

    // Add more conditions if there are more types to support
    return <Text>Unable to preview file type.</Text>;
  };

  const fetchFiles = async () => {
    console.log("Fetch files----->");
    setFetching(true);
    try {
      const response = await fetch(
        "https://stirred-prawn-main.ngrok-free.app/files",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseJson = await response.json();
      setFileData(responseJson);
      setFetching(false);

      console.log("Upload successful!", responseJson);
    } catch (error) {
      setFetching(false);
      console.error(
        "Fetch failed",
        error instanceof Error ? error.message : error
      );
    }
  };

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [viewFile, setViewFile] = useState<FileData | null>(null);

  const ListItem = (props: { file: Item }) => {
    const { file } = props;
    console.log("Received Files------>", file);
    return (
      <Collapsible
        key={file.id}
        title={
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setViewFile({
                name: file.name,
                uri: `https://stirred-prawn-main.ngrok-free.app/file/${file.id}`,
                type: file.type,
              });
            }}
          >
            <View style={styles.listItem}>
              {/* <FilePreview
                fileData={{
                  name: file.name,
                  uri: file.fileUri,
                  type: file.type,
                }}
              /> */}
              <ThemedText>{file.name}</ThemedText>
            </View>
          </TouchableOpacity>
        }
      >
        <View style={styles.listItem}>
          <View style={styles.listItem}>
            <Ionicons size={18} name="like2" />
            <ThemedText>{file.likes}</ThemedText>
          </View>
          <View style={styles.listItem}>
            <Ionicons size={18} name="dislike2" />
            <ThemedText>{file.disLikes}</ThemedText>
          </View>
          <View style={styles.listItem}>
            <Ionicons size={18} name="eyeo" />
            <ThemedText>{file.views}</ThemedText>
          </View>
          <View style={styles.listItem}>
            <Ionicons size={18} name="calendar" />
            <ThemedText>
              {new Date(file.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </Collapsible>
    );
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/bg-2.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Medias</ThemedText>
      </ThemedView>
      <ThemedText>You can find posted medias here.</ThemedText>
      {fetching && <ThemedText>Loading...</ThemedText>}
      {fileData.map((item, index) => (
        <ListItem key={index} file={item} />
      ))}
      <View style={styles.container}>
        <Modal
          visible={modalVisible}
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.fullScreenContainer}
            onPress={() => setModalVisible(false)}
          >
            {viewFile && (
              <FileView
                fileData={{
                  name: viewFile.name,
                  uri: viewFile.uri,
                  type: viewFile.type,
                }}
              />
            )}
          </TouchableOpacity>
        </Modal>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  reactLogo: {
    height: 200,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  preview: {
    width: 50,
    height: 50, // Set any suitable height based on your layout
    resizeMode: "contain", // For images, maintain aspect ratio
  },
  view: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: "contain",
  },
  listItem: {
    flexDirection: "row", // Lays out children in a horizontal line.
    justifyContent: "space-between", // Distributes children evenly across container.
    alignItems: "center",
    gap: 6,
  },
  container: {
    flex: 1,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
