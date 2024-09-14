import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jams.SAU',
  projectId: '66dd728900181357c40b',
  databaseID: '66dd757a003723089701',
  userCollectionId: '66ddc3fb00030aacd3e8',
  videoCollectionId: '66dd761600375aa5627f',
  storageId: '66dd7930001d7e662d63',
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error('Failed to create a new account.');

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseID,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.error('Error during user creation:', error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const activeSession = await getSession(); // Check if a session already exists
    if (activeSession) {
      console.log('A session is already active. Using the existing session.');
      return activeSession; // Use existing session
    }

    // If no session exists, create a new one
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw new Error(error.message || 'Error during sign-in');
  }
};

export const getSession = async () => {
  try {
    const activeSession = await account.getSession('current');
    if (activeSession) {
      console.log('Session found:', activeSession);
      return activeSession;
    }
  } catch (error) {
    console.log('No active session:', error.message);
  }
  return null;
};


export const getAccount = async () => {
  try {
    const session = await getSession();  // Check if there is an active session
    if (!session) {
      console.log('User is not logged in. No session found.');
      return null;
    }

    const accountData = await account.get();  // Get account info if session exists
    console.log('Account data:', accountData);
    return accountData;
  } catch (error) {
    console.error('Error fetching account:', error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();  // Check account before proceeding
    console.log("Current Account ID:", currentAccount.$id); // Log account ID
    if (!currentAccount) {
      console.log('No account found. User may be a guest.');
      return null;
    }

    const currentUser = await databases.listDocuments(
      config.databaseID,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw new Error('No user data found');
    console.log('Current user:', currentUser.documents[0]);
    return currentUser.documents[0];
  } catch (error) {
    console.error('Error during getCurrentUser:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const session = await account.getSession('current');
    if (session) {
      await account.deleteSession('current');  // Delete the current session
      console.log('User signed out successfully');
    } else {
      console.log('No active session found');
    }
  } catch (error) {
    console.error('Error during sign-out:', error.message); // Log the error
    if (error.message.includes('User (role: guests) missing scope (account)')) {
      // This error indicates the user is already treated as a guest
      console.log("User is already logged out or has a guest role.");
    } else {
      throw error;  // Rethrow error for handling in the UI if needed
    }
  }
};


// Retrieve all posts (documents)
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionId
    );
    return posts.documents;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error(error);
  }
};

// Retrieve the latest posts (documents)
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    );
    return posts.documents;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    throw new Error(error);
  }
};

// Search posts by title (documents)
export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseID,
      config.videoCollectionId,
      [Query.search('title', query)]
    );
    return posts.documents;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw new Error(error);
  }
};
export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        config.databaseID,
        config.videoCollectionId,
        [Query.equal("creator", userId)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  export async function uploadFile(file, type) {
    if (!file) return;
  
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };
  
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  export async function createVideoPost(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  export async function getFilePreview(fileId, type) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  
