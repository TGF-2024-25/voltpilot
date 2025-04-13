import { auth } from '../config/firebaseAdmin.js';


const authMiddleware = async (req, res, next) => {
  try {
    //sacar authHeader
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'no existe token de autenticacion' 
      });
    }
    
    //sacar el token desde el authHeader
    const idToken = authHeader.split('Bearer ')[1].trim();
    
    //una consolalog para ver el token
    console.log('Token prefix:', idToken.substring(0, 10) + '...');
    
    if (!idToken || idToken === 'undefined' || idToken === 'null') {
      return res.status(401).json({
        success: false,
        message: 'token no valido o no existe',
      });
    }
    
    // verifica token mediante Firebase Admin 
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (verifyError) {
      console.error('token no valido:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'token no valido',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }
  } catch (error) {
    console.error('error verifica:', error);
    
    let message = 'token no valido o expirado';
    if (error.code === 'auth/id-token-expired') {
      message = 'token expirado vuelvo a iniciar sesion';
    }
    
    return res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default authMiddleware;