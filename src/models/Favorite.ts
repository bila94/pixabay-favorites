import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import { FavoriteAttributes, FavoriteCreationAttributes, FavoriteInstance } from '../types/interfaces';

class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteInstance {
  public id!: number;
  public userId!: number;
  public contentId!: string;
  public contentType!: 'photo' | 'video';
  public contentData!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Favorite.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  contentId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentType: {
    type: DataTypes.ENUM('photo', 'video'),
    allowNull: false
  },
  contentData: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Favorite',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'contentId']
    }
  ]
});

export default Favorite;