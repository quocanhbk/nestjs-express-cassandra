import { UserDefinedType } from '../../../lib/orm/decorators/user-defined-type.decorator';
import { UserDefinedTypeOptions } from '../../../lib/orm/interfaces/user-defined-type-options.interface';
import { getUserDefinedTypeName } from '../../../lib/orm/utils/decorator.utils';

describe('@UserDefinedType', () => {
  it('should set type name using class name in snake_case when no name provided', () => {
    // Arrange & Act
    @UserDefinedType()
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('user_address');
  });

  it('should set type name from string parameter', () => {
    // Arrange & Act
    @UserDefinedType('custom_address')
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('custom_address');
  });

  it('should set type name from options object', () => {
    // Arrange
    const options: UserDefinedTypeOptions = {
      name: 'system_address',
    };

    // Act
    @UserDefinedType(options)
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('system_address');
  });

  it('should convert PascalCase class name to snake_case type name', () => {
    // Arrange & Act
    @UserDefinedType()
    class UserShippingAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserShippingAddress)).toBe(
      'user_shipping_address',
    );
  });

  it('should handle empty string as type name', () => {
    // Arrange & Act
    @UserDefinedType('')
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('');
  });

  it('should handle empty options object', () => {
    // Arrange & Act
    @UserDefinedType({})
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('user_address');
  });

  it('should maintain independent type names for different classes', () => {
    // Arrange & Act
    @UserDefinedType('billing_address')
    class BillingAddress {}

    @UserDefinedType('shipping_address')
    class ShippingAddress {}

    // Assert
    expect(getUserDefinedTypeName(BillingAddress)).toBe('billing_address');
    expect(getUserDefinedTypeName(ShippingAddress)).toBe('shipping_address');
  });

  it('should handle undefined parameter', () => {
    // Arrange & Act
    @UserDefinedType(undefined)
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('user_address');
  });

  it('should handle options object with undefined name', () => {
    // Arrange
    const options: UserDefinedTypeOptions = {
      name: undefined,
    };

    // Act
    @UserDefinedType(options)
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('user_address');
  });

  it('should preserve case in explicitly provided names', () => {
    // Arrange & Act
    @UserDefinedType('CustomAddress')
    class UserAddress {}

    // Assert
    expect(getUserDefinedTypeName(UserAddress)).toBe('CustomAddress');
  });
});
