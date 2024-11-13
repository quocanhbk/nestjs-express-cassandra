import { types } from 'cassandra-driver';
import {
  Column,
  GeneratedUuidColumn,
} from '../../../lib/orm/decorators/column.decorator';
import { OrmError } from '../../../lib/orm/errors';
import { ColumnOptions } from '../../../lib/orm/interfaces';
import {
  getAttributes,
  getOptions,
} from '../../../lib/orm/utils/decorator.utils';

describe('@Column', () => {
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

describe('@GeneratedUuidColumn', () => {
  it('should set up UUID column with default configuration', () => {
    // Act
    class TestClass {
      @GeneratedUuidColumn()
      id: types.Uuid;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.id).toEqual({
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    });
  });

  it('should set up TimeUUID column when specified', () => {
    // Act
    class TestClass {
      @GeneratedUuidColumn('timeuuid')
      id: types.TimeUuid;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes.id).toEqual({
      type: 'timeuuid',
      default: { $db_function: 'now()' },
    });
  });

  it('should generate UUID value before save if not set', () => {
    // Arrange
    class TestClass {
      @GeneratedUuidColumn()
      id: types.Uuid;
    }
    const instance = new TestClass();

    // Act
    const options = getOptions(TestClass.prototype);
    const beforeSaveHook = options.before_save;
    beforeSaveHook(instance);

    // Assert
    expect(instance.id).toBeInstanceOf(types.Uuid);
  });

  it('should generate TimeUUID value before save if not set', () => {
    // Arrange
    class TestClass {
      @GeneratedUuidColumn('timeuuid')
      id: types.TimeUuid;
    }
    const instance = new TestClass();

    // Act
    const options = getOptions(TestClass.prototype);
    const beforeSaveHook = options.before_save;
    beforeSaveHook(instance);

    // Assert
    expect(instance.id).toBeInstanceOf(types.TimeUuid);
  });

  it('should not override existing UUID value before save', () => {
    // Arrange
    class TestClass {
      @GeneratedUuidColumn()
      id: types.Uuid;
    }
    const instance = new TestClass();
    const existingId = types.Uuid.random();
    instance.id = existingId;

    // Act
    const descriptor = Object.getOwnPropertyDescriptor(
      TestClass.prototype,
      'beforeSave',
    );
    descriptor.value && descriptor.value(instance);

    // Assert
    expect(instance.id).toBe(existingId);
  });

  it('should not override existing TimeUUID value before save', () => {
    // Arrange
    class TestClass {
      @GeneratedUuidColumn('timeuuid')
      id: types.TimeUuid;
    }
    const instance = new TestClass();
    const existingId = types.TimeUuid.now();
    instance.id = existingId;

    // Act
    const descriptor = Object.getOwnPropertyDescriptor(
      TestClass.prototype,
      'beforeSave',
    );
    descriptor.value && descriptor.value(instance);

    // Assert
    expect(instance.id).toBe(existingId);
  });

  it('should handle null instance in beforeSave hook', () => {
    // Arrange
    class TestClass {
      @GeneratedUuidColumn()
      id: types.Uuid;
    }

    // Act & Assert
    const descriptor = Object.getOwnPropertyDescriptor(
      TestClass.prototype,
      'beforeSave',
    );
    expect(() => descriptor.value && descriptor.value(null)).not.toThrow();
  });

  it('should allow multiple UUID columns in the same class', () => {
    // Act
    class TestClass {
      @GeneratedUuidColumn()
      id1: types.Uuid;

      @GeneratedUuidColumn('timeuuid')
      id2: types.TimeUuid;
    }

    // Assert
    const attributes = getAttributes(TestClass.prototype);
    expect(attributes).toEqual({
      id1: {
        type: 'uuid',
        default: { $db_function: 'uuid()' },
      },
      id2: {
        type: 'timeuuid',
        default: { $db_function: 'now()' },
      },
    });
  });
});
