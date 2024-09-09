import { Client,Account,ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const  config = {
    endpoint : 'https://cloud.appwrite.io/v1',
    platform : 'com.jams.SAU',
    projectId: '66dd728900181357c40b',
    databaseID : '66dd757a003723089701',
    userCollectionId: '66ddc3fb00030aacd3e8',
    videoCollectionId: '66dd761600375aa5627f',
    storageId : '66dd7930001d7e662d63'
}
const {
    endpoint ,
    platform ,
    projectId,
    databaseID,
    userCollectionId,
    videoCollectionId,
    storageId
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)  
    .setPlatform(config.platform) 
    const account = new Account(client);
    const avatars = new Avatars (client);
    const databases = new Databases (client);
   export const createUser = async (email,password,username) => {
       try {
       const newAccount = await account.create (
        ID.unique(),
        email,
        password,
        username
       ) 
       if (!newAccount) throw Error;
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
            avatar : avatarUrl
        }
       )
       return newUser;
       } catch (error) {
        console.log(error);
        throw new Error (error);
        
       }
    }
    export const signIn = async (email, password) => {
        try {
            // Check for an existing session before creating a new one
            const activeSession = await account.getSession('current');  // Get the current active session
            if (activeSession) {
                console.log('A session is already active. Using the existing session.');
                return activeSession;  // Return the existing session instead of creating a new one
            }
    
            // If no active session, create a new one
            const session = await account.createEmailSession(email, password);
            return session;
    
        } catch (error) { 
            if (error.message.includes('Session not found')) {
                // Create a new session if there are no active sessions
                const session = await account.createEmailSession(email, password);
                return session;
            }
            throw new Error(error.message || 'Error during sign-in');
        }
    }
        export const getCurrentUser = async () => {
            try {
                const currentAccount = await account.get();
                if (!currentAccount) throw Error;
                const currentUser = await databases.listDocuments(
                    config.databaseID,
                    config.userCollectionId,
                    [Query.equal('accountId', currentAccount.$id)]
                )
                if(!currentUser) throw Error;
                return currentUser.documents[0];
            } catch (error) {
                console.log(error);
                
            }
        }    

    export const getAllPosts = async () => {
        try {
            const posts = await databases.listDocuments (
                databaseID,
                videoCollectionId
            )
            return posts.documents;
        } catch (error) {
            throw new Error (error);
            
        }
    }
    export const getLatestPosts = async () => {
        try {
            const posts = await databases.listDocuments (
                databaseID,
                videoCollectionId,
                [Query.orderDesc('$createAt',Query.limit(7))]
            )
            return posts.documents;
        } catch (error) {
            throw new Error (error);
            
        }
    }