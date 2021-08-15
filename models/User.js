module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    voornaam: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    achternaam: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    emailadres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    geboortedatum: {
      type: DataTypes.DATE,
    },
    wachtwoord: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Hours, {
      onDelete: 'cascade',
    });
  };

  return User;
};
