import { Entity } from '../../../lib/orm/decorators/entity.decorator';
import { EntityOptions } from '../../../lib/orm/interfaces';
import {
  getEntityName,
  getOptions,
} from '../../../lib/orm/utils/decorator.utils';

describe('Entity Decorator', () => {
  it('should set entity name using class name in plural snake_case when no name provided', () => {
    // Arrange & Act
    @Entity()
    class UserEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('user_entities');
  });

  it('should set entity name from string parameter', () => {
    // Arrange & Act
    @Entity('custom_users')
    class UserEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('custom_users');
  });

  it('should set entity name from table_name option', () => {
    // Arrange & Act
    @Entity({ table_name: 'system_users' })
    class UserEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('system_users');
  });

  it('should throw error when string name parameter and table_name option are provided', () => {
    // Assert
    expect(() => {
      // Arrange & Act
      @Entity('priority_users', { table_name: 'system_users' })
      class UserEntity {}
    }).toThrow(
      'Cannot specify table name in both parameters. Use either string parameter or options.table_name, not both.',
    );
  });

  it('should add instance and class methods to options', () => {
    // Arrange & Act
    @Entity()
    class UserEntity {}

    // Assert
    const options = getOptions(UserEntity);
    expect(options.instanceMethods).toBe(UserEntity.prototype);
    expect(options.classMethods).toBe(UserEntity);
  });

  it('should merge provided options with instance and class methods', () => {
    // Arrange
    const options: EntityOptions = {
      timestamps: true,
      saveUnknown: false,
    };

    // Act
    @Entity(options)
    class UserEntity {}

    // Assert
    const resultOptions = getOptions(UserEntity);
    expect(resultOptions).toEqual({
      timestamps: true,
      saveUnknown: false,
      instanceMethods: UserEntity.prototype,
      classMethods: UserEntity,
    });
  });

  it('should handle both name and options parameters', () => {
    // Arrange
    const options: EntityOptions = {
      timestamps: true,
    };

    // Act
    @Entity('custom_users', options)
    class UserEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('custom_users');
    expect(getOptions(UserEntity)).toEqual({
      timestamps: true,
      instanceMethods: UserEntity.prototype,
      classMethods: UserEntity,
    });
  });

  it('should handle empty options', () => {
    // Arrange & Act
    @Entity({})
    class UserEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('user_entities');
    expect(getOptions(UserEntity)).toEqual({
      instanceMethods: UserEntity.prototype,
      classMethods: UserEntity,
    });
  });

  it('should convert PascalCase class name to plural snake_case table name', () => {
    // Arrange & Act
    @Entity()
    class UserProfileEntity {}

    // Assert
    expect(getEntityName(UserProfileEntity)).toBe('user_profile_entities');
  });

  it('should preserve existing options when adding methods', () => {
    // Arrange
    const complexOptions: EntityOptions = {
      timestamps: true,
      clusteringOrder: { createdAt: 'desc' },
      indexes: ['email'],
      table_name: 'complex_users',
    };

    // Act
    @Entity(complexOptions)
    class UserEntity {
      public someMethod() {}
      public static someStaticMethod() {}
    }

    // Assert
    const resultOptions = getOptions(UserEntity);
    expect(resultOptions).toEqual({
      ...complexOptions,
      instanceMethods: UserEntity.prototype,
      classMethods: UserEntity,
    });
  });

  it('should handle undefined options', () => {
    // Arrange & Act
    @Entity(undefined)
    class UserEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('user_entities');
    expect(getOptions(UserEntity)).toEqual({
      instanceMethods: UserEntity.prototype,
      classMethods: UserEntity,
    });
  });

  it('should handle multiple decorations on different classes independently', () => {
    // Arrange & Act
    @Entity('users')
    class UserEntity {}

    @Entity('profiles')
    class ProfileEntity {}

    // Assert
    expect(getEntityName(UserEntity)).toBe('users');
    expect(getEntityName(ProfileEntity)).toBe('profiles');
  });
});
