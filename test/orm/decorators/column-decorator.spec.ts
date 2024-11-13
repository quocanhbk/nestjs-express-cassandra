import { Column } from '../../../lib/orm/decorators/column.decorator';
import { OrmError } from '../../../lib/orm/errors';
import { ColumnOptions } from '../../../lib/orm/interfaces';
import { getAttributes } from '../../../lib/orm/utils/decorator.utils';

describe('Column Decorator', () => {
  class TestEntity {}

  it('should add column with basic type', () => {
    // Arrange
    const options: ColumnOptions = { type: 'text' };

    // Act
    class TestClass {
      @Column(options)
      name: string;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.name).toEqual(options);
  });

  it('should add multiple columns to the same entity', () => {
    // Arrange
    const nameOptions: ColumnOptions = { type: 'text' };
    const ageOptions: ColumnOptions = { type: 'int' };

    // Act
    class TestClass {
      @Column(nameOptions)
      name: string;

      @Column(ageOptions)
      age: number;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes).toEqual({
      name: nameOptions,
      age: ageOptions,
    });
  });

  it('should handle complex column options', () => {
    // Arrange
    const options: ColumnOptions = {
      type: 'text',
      static: true,
      default: 'default value',
      rule: {
        validator: (value: string) => value.length > 3,
        message: 'Must be longer than 3 characters',
      },
    };

    // Act
    class TestClass {
      @Column(options)
      description: string;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.description).toEqual(options);
  });

  it('should handle collection types', () => {
    // Arrange
    const options: ColumnOptions = {
      type: 'list',
      typeDef: '<text>',
    };

    // Act
    class TestClass {
      @Column(options)
      tags: string[];
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.tags).toEqual(options);
  });

  it('should handle map type with complex typeDef', () => {
    // Arrange
    const options: ColumnOptions = {
      type: 'list',
      typeDef: '<int>',
    };

    // Act
    class TestClass {
      @Column(options)
      scores: Map<string, number>;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.scores).toEqual(options);
  });

  it('should maintain independent columns for different classes', () => {
    // Arrange & Act
    class FirstClass {
      @Column({ type: 'text' })
      name: string;
    }

    class SecondClass {
      @Column({ type: 'int' })
      age: number;
    }

    // Assert
    const firstAttributes = getAttributes(FirstClass.prototype);
    const secondAttributes = getAttributes(SecondClass.prototype);

    expect(firstAttributes).toEqual({ name: { type: 'text' } });
    expect(secondAttributes).toEqual({ age: { type: 'int' } });
  });

  it('should handle frozen collections', () => {
    // Arrange
    const options: ColumnOptions = {
      type: 'frozen',
      typeDef: '<list<text>>',
    };

    // Act
    class TestClass {
      @Column(options)
      frozenList: string[];
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.frozenList).toEqual(options);
  });

  describe('Type inference', () => {
    it('should infer text type for string properties', () => {
      // Act
      class TestClass {
        @Column()
        name: string;
      }

      // Assert
      const attributes = getAttributes(TestClass.prototype);
      expect(attributes.name).toEqual({ type: 'text' });
    });

    it('should infer int type for number properties', () => {
      // Act
      class TestClass {
        @Column()
        age: number;
      }

      // Assert
      const attributes = getAttributes(TestClass.prototype);
      expect(attributes.age).toEqual({ type: 'int' });
    });

    it('should infer boolean type for boolean properties', () => {
      // Act
      class TestClass {
        @Column()
        isActive: boolean;
      }

      // Assert
      const attributes = getAttributes(TestClass.prototype);
      expect(attributes.isActive).toEqual({ type: 'boolean' });
    });

    it('should use explicit type over inferred type', () => {
      // Act
      class TestClass {
        @Column({ type: 'varchar' })
        name: string;
      }

      // Assert
      const attributes = getAttributes(TestClass.prototype);
      expect(attributes.name).toEqual({ type: 'varchar' });
    });

    it('should merge inferred type with other options', () => {
      // Act
      class TestClass {
        @Column({ default: 'default value' })
        name: string;
      }

      // Assert
      const attributes = getAttributes(TestClass.prototype);
      expect(attributes.name).toEqual({
        type: 'text',
        default: 'default value',
      });
    });

    it('should handle multiple inferred types in the same class', () => {
      // Act
      class TestClass {
        @Column()
        name: string;

        @Column()
        age: number;

        @Column()
        isActive: boolean;
      }

      // Assert
      const attributes = getAttributes(TestClass.prototype);
      expect(attributes).toEqual({
        name: { type: 'text' },
        age: { type: 'int' },
        isActive: { type: 'boolean' },
      });
    });

    it('should throw OrmError for unsupported types', () => {
      // Arrange
      class CustomType {}

      // Act & Assert
      expect(() => {
        class TestClass {
          @Column()
          custom: CustomType;
        }
      }).toThrow(OrmError);

      try {
        class TestClass {
          @Column()
          custom: CustomType;
        }
      } catch (error) {
        expect(error.name).toBe('OrmError');
        expect(error.code).toBe('UNSUPPORTED_TYPE');
        expect(error.metadata).toEqual({
          property: 'custom',
          type: 'CustomType',
          context: 'column_decorator',
          solution:
            'Please explicitly specify the column type using @Column({ type: "desired_type" })',
        });
      }
    });

    it('should not throw error when type is explicitly specified for custom type', () => {
      // Arrange
      class CustomType {}

      // Act & Assert
      expect(() => {
        class TestClass {
          @Column({ type: 'text' })
          custom: CustomType;
        }
      }).not.toThrow();
    });
  });
});
