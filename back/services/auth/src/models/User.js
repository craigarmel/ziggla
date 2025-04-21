const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis']
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez fournir un email valide'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: 6,
      select: false
    },
    username: {
      type: String,
      unique: true,
      sparse: true
    },
    phoneNumber: {
      type: String,
      default: null
    },
    profilePicture: {
      type: String,
      default: null
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    preferredLanguage: {
      type: String,
      default: 'fr'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager', 'support'],
      default: 'user'
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    addresses: [
      {
        title: String,
        address: String,
        postalCode: String,
        city: String,
        country: String
      }
    ],
    paymentMethods: [
      {
        type: { type: String },
        lastFour: String,
        isDefault: Boolean
      }
    ],
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      promotions: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

// Crypter le mot de passe avant d'enregistrer
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;