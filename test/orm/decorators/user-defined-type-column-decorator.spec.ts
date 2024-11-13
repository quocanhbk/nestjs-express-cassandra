import { UserDefinedTypeColumn } from '../../../lib/orm/decorators/user-defined-type-column.decorator';
import { UserDefinedTypeColumnOptions } from '../../../lib/orm/interfaces/user-defined-type-options.interface';
import { getAttributes } from '../../../lib/orm/utils/decorator.utils';

describe('@UserDefinedTypeColumn', () => {
  it('should add user defined type column with basic options', () => {
    // Arrange
    const options: UserDefinedTypeColumnOptions = {
      type: 'frozen',
    };

    // Act
    class TestClass {
      @UserDefinedTypeColumn(options)
      address: any;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.address).toEqual(options);
  });

  it('should handle multiple user defined type columns in the same class', () => {
    // Arrange
    const addressOptions: UserDefinedTypeColumnOptions = {
      type: 'frozen',
    };
    const contactOptions: UserDefinedTypeColumnOptions = {
      type: 'text',
    };

    // Act
    class TestClass {
      @UserDefinedTypeColumn(addressOptions)
      address: any;

      @UserDefinedTypeColumn(contactOptions)
      contact: any;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes).toEqual({
      address: addressOptions,
      contact: contactOptions,
    });
  });

  it('should maintain independent columns for different classes', () => {
    // Arrange
    const addressOptions: UserDefinedTypeColumnOptions = {
      type: 'frozen',
    };
    const contactOptions: UserDefinedTypeColumnOptions = {
      type: 'text',
    };

    // Act
    class FirstClass {
      @UserDefinedTypeColumn(addressOptions)
      address: any;
    }

    class SecondClass {
      @UserDefinedTypeColumn(contactOptions)
      contact: any;
    }

    // Assert
    const firstAttributes = getAttributes(FirstClass.prototype);
    const secondAttributes = getAttributes(SecondClass.prototype);

    expect(firstAttributes).toEqual({ address: addressOptions });
    expect(secondAttributes).toEqual({ contact: contactOptions });
  });

  it('should handle complex type definitions', () => {
    // Arrange
    const options: UserDefinedTypeColumnOptions = {
      type: 'list',
    };

    // Act
    class TestClass {
      @UserDefinedTypeColumn(options)
      addresses: any[];
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.addresses).toEqual(options);
  });

  it('should work with additional column options', () => {
    // Arrange
    const options: UserDefinedTypeColumnOptions = {
      type: 'frozen',
    };

    // Act
    class TestClass {
      @UserDefinedTypeColumn(options)
      address: any;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.address).toEqual(options);
  });

  it('should handle map with user defined type', () => {
    // Arrange
    const options: UserDefinedTypeColumnOptions = {
      type: 'map',
    };

    // Act
    class TestClass {
      @UserDefinedTypeColumn(options)
      addressMap: Map<string, any>;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.addressMap).toEqual(options);
  });

  it('should work with set of user defined types', () => {
    // Arrange
    const options: UserDefinedTypeColumnOptions = {
      type: 'set',
    };

    // Act
    class TestClass {
      @UserDefinedTypeColumn(options)
      addresses: Set<any>;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.addresses).toEqual(options);
  });
});
