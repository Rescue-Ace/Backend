const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
  } = require('../config/firebase');
  const { storeUserData } = require('../config/firestore');
  const auth = getAuth();
  
  class FirebaseAuthController {
    async registerUser(request, h) {
      const { email, password, confirmPassword, fullName, dateOfBirth } = request.payload;
  
      if (!email || !password || !confirmPassword || !fullName || !dateOfBirth) {
        return h.response({ error: 'All fields are required' }).code(422);
      }
  
      if (password !== confirmPassword) {
        return h.response({ error: 'Passwords do not match' }).code(422);
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        const createdDate = new Date().toISOString();
        const { uid } = userCredential.user;
        const data = {
          "userId": uid,
          "fullName": fullName,
          "dateOfBirth": dateOfBirth,
          "email": email,
          "createdDate": createdDate,
          "updatedDate": createdDate,
        }
        await storeUserData(uid,data);
        return h.response({ message: 'Verification email sent! User created successfully!' }).code(201);
      } catch (error) {
        console.error(error);
        const errorMessage = error.message || 'An error occurred while registering user';
        return h.response({ error: errorMessage }).code(500);
      }
    }
  
    async loginUser(request, h) {
      const { email, password } = request.payload;
      if (!email || !password) {
        return h.response({
          email: 'Email is required',
          password: 'Password is required',
        }).code(422);
      }
  
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = userCredential._tokenResponse.idToken;
        if (idToken) {
          h.state('access_token', idToken, {
            isHttpOnly: true,
            ttl: null,
            encoding: 'base64json',
          });
          return h.response({
            message: 'User logged in successfully',
            userCredential,
          }).code(200);
        } else {
          return h.response({ error: 'Internal Server Error' }).code(500);
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.message || 'An error occurred while logging in';
        return h.response({ error: errorMessage }).code(500);
      }
    }
  
    async logoutUser(request, h) {
      try {
        await signOut(auth);
        h.unstate('access_token');
        return h.response({ message: 'User logged out successfully' }).code(200);
      } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    }
  
    async resetPassword(request, h) {
      const { email } = request.payload;
      if (!email) {
        return h.response({ email: 'Email is required' }).code(422);
      }
  
      try {
        await sendPasswordResetEmail(auth, email);
        return h.response({ message: 'Password reset email sent successfully!' }).code(200);
      } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    }
  }
  
  module.exports = new FirebaseAuthController();