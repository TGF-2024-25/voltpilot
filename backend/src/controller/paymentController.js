import { db } from '../config/firebaseAdmin.js';

const paymentsController = {

  savePaymentMethod: async (req, res) => {
    try {
      const { userId, type, email, authToken } = req.body;
      
      if (!userId || !type || !email) {
        return res.status(400).json({ error: 'falta datos paypal' });
      }

      const paymentRef = db.collection('payments').doc();
      await paymentRef.set({
        userId,
        type,
        email,
        authToken,
        createdAt: new Date()
      });

      return res.status(201).json({ 
        success: true, 
        data: { id: paymentRef.id, email, type } 
      });
    } catch (error) {
      console.error('erro guarda datos en paypal:', error);
      return res.status(500).json({ error: 'error paypal de backend' });
    }
  },

  getSavedPaymentMethods: async (req, res) => {
    try {
      const { uid } = req.params;
      
      if (!uid) {
        return res.status(400).json({ error: 'falta userid' });
      }

      const snapshot = await db.collection('payments')
        .where('userId', '==', uid)
        .get();
      
      const methods = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        methods.push({
          id: doc.id,
          email: data.email,
          type: data.type
        });
      });

      return res.status(200).json({ 
        success: true, 
        data: methods 
      });
    } catch (error) {
      console.error('error conseguir metodo de pago:', error);
      return res.status(500).json({ error: 'error paypal de backend' });
    }
  },

  deleteSavedPaymentMethod: async (req, res) => {
    try {
      const { userId, methodId } = req.body;
      
      if (!userId || !methodId) {
        return res.status(400).json({ error: 'falta userId o pagoId' });
      }

      await db.collection('payments').doc(methodId).delete();

      return res.status(200).json({ 
        success: true,
        message: 'has borrado el metodo de pago' 
      });
    } catch (error) {
      console.error('error borrar metodo de pago:', error);
      return res.status(500).json({ error: 'error paypal de backend' });
    }
  }
};

export default paymentsController;