import User from './User';
import Favorite from './Favorite';

// Define associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  User,
  Favorite
};