import {
  addAttribute,
  addAttributeOptions,
  addHookFunction,
  addOptions,
  getAttributes,
  getEntity,
  getEntityName,
  getOptions,
  getUserDefinedTypeName,
  setAttributes,
  setEntity,
  setEntityName,
  setOptions,
  setUserDefinedTypeName,
} from '../../lib/orm/utils/decorator.utils';

describe('Decorator utils', () => {
  describe('Entity metadata', () => {
    class TestEntity {}
    class TargetClass {}

    it('should set and get entity metadata correctly', () => {
      // Arrange
      const target = TargetClass;

      // Act
      setEntity(target, TestEntity);
      const retrievedEntity = getEntity(target);

      // Assert
      expect(retrievedEntity).toBe(TestEntity);
    });

    it('should return undefined when getting entity metadata that was not set', () => {
      // Arrange
      const target = class EmptyClass {};

      // Act
      const retrievedEntity = getEntity(target);

      // Assert
      expect(retrievedEntity).toBeUndefined();
    });

    it('should override previous entity metadata when setting multiple times', () => {
      // Arrange
      const target = TargetClass;
      class NewTestEntity {}

      // Act
      setEntity(target, TestEntity);
      setEntity(target, NewTestEntity);
      const retrievedEntity = getEntity(target);

      // Assert
      expect(retrievedEntity).toBe(NewTestEntity);
      expect(retrievedEntity).not.toBe(TestEntity);
    });

    it('should store metadata on the correct target', () => {
      // Arrange
      const target1 = class Target1 {};
      const target2 = class Target2 {};

      // Act
      setEntity(target1, TestEntity);

      // Assert
      expect(getEntity(target1)).toBe(TestEntity);
      expect(getEntity(target2)).toBeUndefined();
    });
  });

  describe('Entity name metadata', () => {
    class TargetClass {}

    it('should set and get entity name correctly', () => {
      // Arrange
      const target = TargetClass;
      const entityName = 'TestEntityTable';

      // Act
      setEntityName(target, entityName);
      const retrievedName = getEntityName(target);

      // Assert
      expect(retrievedName).toBe(entityName);
    });

    it('should return undefined when getting entity name that was not set', () => {
      // Arrange
      const target = class EmptyClass {};

      // Act
      const retrievedName = getEntityName(target);

      // Assert
      expect(retrievedName).toBeUndefined();
    });

    it('should override previous entity name when setting multiple times', () => {
      // Arrange
      const target = TargetClass;
      const firstEntityName = 'FirstEntityTable';
      const secondEntityName = 'SecondEntityTable';

      // Act
      setEntityName(target, firstEntityName);
      setEntityName(target, secondEntityName);
      const retrievedName = getEntityName(target);

      // Assert
      expect(retrievedName).toBe(secondEntityName);
      expect(retrievedName).not.toBe(firstEntityName);
    });

    it('should store entity names independently for different targets', () => {
      // Arrange
      const target1 = class Target1 {};
      const target2 = class Target2 {};
      const entityName1 = 'EntityTable1';
      const entityName2 = 'EntityTable2';

      // Act
      setEntityName(target1, entityName1);
      setEntityName(target2, entityName2);

      // Assert
      expect(getEntityName(target1)).toBe(entityName1);
      expect(getEntityName(target2)).toBe(entityName2);
    });

    it('should handle empty string as entity name', () => {
      // Arrange
      const target = TargetClass;
      const emptyEntityName = '';

      // Act
      setEntityName(target, emptyEntityName);
      const retrievedName = getEntityName(target);

      // Assert
      expect(retrievedName).toBe(emptyEntityName);
    });
  });

  describe('User defined type name metadata', () => {
    class TargetClass {}

    it('should set and get user defined type name correctly', () => {
      // Arrange
      const target = TargetClass;
      const userDefinedTypeName = 'TestUserDefinedType';

      // Act
      setUserDefinedTypeName(target, userDefinedTypeName);
      const retrievedName = getUserDefinedTypeName(target);

      // Assert
      expect(retrievedName).toBe(userDefinedTypeName);
    });

    it('should return undefined when getting user defined type name that was not set', () => {
      // Arrange
      const target = class EmptyClass {};

      // Act
      const retrievedName = getUserDefinedTypeName(target);

      // Assert
      expect(retrievedName).toBeUndefined();
    });

    it('should override previous user defined type name when setting multiple times', () => {
      // Arrange
      const target = TargetClass;
      const firstUserDefinedTypeName = 'FirstUserDefinedType';
      const secondUserDefinedTypeName = 'SecondUserDefinedType';

      // Act
      setUserDefinedTypeName(target, firstUserDefinedTypeName);
      setUserDefinedTypeName(target, secondUserDefinedTypeName);
      const retrievedName = getUserDefinedTypeName(target);

      // Assert
      expect(retrievedName).toBe(secondUserDefinedTypeName);
    });

    it('should store user defined type names independently for different targets', () => {
      // Arrange
      const target1 = class Target1 {};
      const target2 = class Target2 {};
      const userDefinedTypeName1 = 'UserDefinedType1';
      const userDefinedTypeName2 = 'UserDefinedType2';

      // Act
      setUserDefinedTypeName(target1, userDefinedTypeName1);
      setUserDefinedTypeName(target2, userDefinedTypeName2);

      // Assert
      expect(getUserDefinedTypeName(target1)).toBe(userDefinedTypeName1);
      expect(getUserDefinedTypeName(target2)).toBe(userDefinedTypeName2);
    });

    it('should handle empty string as user defined type name', () => {
      // Arrange
      const target = TargetClass;
      const emptyUserDefinedTypeName = '';

      // Act
      setUserDefinedTypeName(target, emptyUserDefinedTypeName);
      const retrievedName = getUserDefinedTypeName(target);

      // Assert
      expect(retrievedName).toBe(emptyUserDefinedTypeName);
    });
  });

  describe('Attributes metadata', () => {
    class TargetClass {}

    it('should set and get attributes correctly', () => {
      // Arrange
      const target = TargetClass;
      const attributes = {
        name: { type: 'text' },
        age: { type: 'int' },
      };

      // Act
      setAttributes(target, attributes);
      const retrievedAttributes = getAttributes(target);

      // Assert
      expect(retrievedAttributes).toEqual(attributes);
    });

    it('should return empty object when getting attributes that were not set', () => {
      // Arrange
      const target = class EmptyClass {};

      // Act
      const retrievedAttributes = getAttributes(target);

      // Assert
      expect(retrievedAttributes).toEqual({});
    });

    it('should add new attribute correctly', () => {
      // Arrange
      const target = TargetClass;
      const attributeName = 'email';
      const attributeOptions = { type: 'text', required: true };

      // Act
      addAttribute(target, attributeName, attributeOptions);
      const retrievedAttributes = getAttributes(target);

      // Assert
      expect(retrievedAttributes[attributeName]).toEqual(attributeOptions);
    });

    it('should override existing attribute when adding with same name', () => {
      // Arrange
      const target = TargetClass;
      const attributeName = 'email';
      const initialOptions = { type: 'text' };
      const newOptions = { type: 'varchar', required: true };

      // Act
      addAttribute(target, attributeName, initialOptions);
      addAttribute(target, attributeName, newOptions);
      const retrievedAttributes = getAttributes(target);

      // Assert
      expect(retrievedAttributes[attributeName]).toEqual(newOptions);
    });

    it('should merge attribute options correctly', () => {
      // Arrange
      const target = TargetClass;
      const attributeName = 'email';
      const initialOptions = { type: 'text', required: true };
      const additionalOptions = { index: true, default: 'test@example.com' };
      const expectedOptions = {
        type: 'text',
        required: true,
        index: true,
        default: 'test@example.com',
      };

      // Act
      addAttribute(target, attributeName, initialOptions);
      addAttributeOptions(target, attributeName, additionalOptions);
      const retrievedAttributes = getAttributes(target);

      // Assert
      expect(retrievedAttributes[attributeName]).toEqual(expectedOptions);
    });

    it('should handle deep merging of attribute options', () => {
      // Arrange
      const target = TargetClass;
      const attributeName = 'profile';
      const initialOptions = {
        type: 'map',
        typeDef: { key: 'text', value: 'text' },
      };
      const additionalOptions = {
        typeDef: { value: 'varchar' },
        required: true,
      };
      const expectedOptions = {
        type: 'map',
        typeDef: { key: 'text', value: 'varchar' },
        required: true,
      };

      // Act
      addAttribute(target, attributeName, initialOptions);
      addAttributeOptions(target, attributeName, additionalOptions);
      const retrievedAttributes = getAttributes(target);

      // Assert
      expect(retrievedAttributes[attributeName]).toEqual(expectedOptions);
    });

    it('should maintain independent attributes for different targets', () => {
      // Arrange
      const target1 = class Target1 {};
      const target2 = class Target2 {};
      const attributes1 = { name: { type: 'text' } };
      const attributes2 = { age: { type: 'int' } };

      // Act
      setAttributes(target1, attributes1);
      setAttributes(target2, attributes2);

      // Assert
      expect(getAttributes(target1)).toEqual(attributes1);
      expect(getAttributes(target2)).toEqual(attributes2);
    });

    it('should create a new instance of attributes on each get', () => {
      // Arrange
      const target = TargetClass;
      const attributes = { name: { type: 'text' } };
      setAttributes(target, attributes);

      // Act
      const retrieved1 = getAttributes(target);
      const retrieved2 = getAttributes(target);

      // Assert
      expect(retrieved1).toEqual(retrieved2);
      expect(retrieved1).not.toBe(retrieved2);
    });
  });

  describe('Options metadata', () => {
    class TargetClass {}

    it('should set and get options correctly', () => {
      // Arrange
      const target = TargetClass;
      const options = {
        timestamps: true,
        saveUnknown: false,
      };

      // Act
      setOptions(target, options);
      const retrievedOptions = getOptions(target);

      // Assert
      expect(retrievedOptions).toEqual(options);
    });

    it('should return empty object when getting options that were not set', () => {
      // Arrange
      const target = class EmptyClass {};

      // Act
      const retrievedOptions = getOptions(target);

      // Assert
      expect(retrievedOptions).toEqual({});
    });

    it('should merge new options with existing ones', () => {
      // Arrange
      const target = TargetClass;
      const initialOptions = { timestamps: true, saveUnknown: false };
      const additionalOptions = {
        ttl: 86400,
        clusteringOrder: { created: 'desc' },
      };
      const expectedOptions = {
        timestamps: true,
        saveUnknown: false,
        ttl: 86400,
        clusteringOrder: { created: 'desc' },
      };

      // Act
      setOptions(target, initialOptions);
      addOptions(target, additionalOptions);
      const retrievedOptions = getOptions(target);

      // Assert
      expect(retrievedOptions).toEqual(expectedOptions);
    });

    it('should override existing options with new values', () => {
      // Arrange
      const target = TargetClass;
      const initialOptions = { timestamps: true, ttl: 3600 };
      const newOptions = { timestamps: false, ttl: 7200 };
      const expectedOptions = { timestamps: false, ttl: 7200 };

      // Act
      setOptions(target, initialOptions);
      setOptions(target, newOptions);
      const retrievedOptions = getOptions(target);

      // Assert
      expect(retrievedOptions).toEqual(expectedOptions);
    });

    it('should handle deep merging of options', () => {
      // Arrange
      const target = TargetClass;
      const initialOptions = {
        timestamps: true,
        indexes: {
          name_idx: {
            name: 'text',
          },
        },
      };
      const additionalOptions = {
        indexes: {
          name_idx: {
            age: 'number',
          },
          email_idx: {
            email: 'text',
          },
        },
      };
      const expectedOptions = {
        timestamps: true,
        indexes: {
          name_idx: {
            name: 'text',
            age: 'number',
          },
          email_idx: {
            email: 'text',
          },
        },
      };

      // Act
      setOptions(target, initialOptions);
      addOptions(target, additionalOptions);
      const retrievedOptions = getOptions(target);

      // Assert
      expect(retrievedOptions).toEqual(expectedOptions);
    });

    it('should maintain independent options for different targets', () => {
      // Arrange
      const target1 = class Target1 {};
      const target2 = class Target2 {};
      const options1 = { timestamps: true };
      const options2 = { saveUnknown: true };

      // Act
      setOptions(target1, options1);
      setOptions(target2, options2);

      // Assert
      expect(getOptions(target1)).toEqual(options1);
      expect(getOptions(target2)).toEqual(options2);
    });

    it('should create a new instance of options on each get', () => {
      // Arrange
      const target = TargetClass;
      const options = { timestamps: true };
      setOptions(target, options);

      // Act
      const retrieved1 = getOptions(target);
      const retrieved2 = getOptions(target);

      // Assert
      expect(retrieved1).toEqual(retrieved2);
      expect(retrieved1).not.toBe(retrieved2);
    });

    it('should handle adding options when none exist', () => {
      // Arrange
      const target = TargetClass;
      const newOptions = { timestamps: true };

      // Act
      addOptions(target, newOptions);
      const retrievedOptions = getOptions(target);

      // Assert
      expect(retrievedOptions).toEqual(newOptions);
    });
  });

  describe('Hook Functions', () => {
    class TargetClass {}
    const HOOK_KEY = 'test:hook';

    afterEach(() => {
      Reflect.deleteMetadata(HOOK_KEY, TargetClass);
    });

    it('should execute hook functions with provided arguments', () => {
      // Arrange
      const target = TargetClass;
      const hookFn1 = jest.fn(x => x + 1);
      const hookFn2 = jest.fn(x => x * 2);
      Reflect.defineMetadata(HOOK_KEY, [hookFn1, hookFn2], target);

      // Act
      const executeHooks = addHookFunction(target, HOOK_KEY);
      const results = executeHooks(5);

      // Assert
      expect(hookFn1).toHaveBeenCalledWith(5);
      expect(hookFn2).toHaveBeenCalledWith(5);
      expect(results).toEqual([6, 10]);
    });

    it('should return empty array when no hooks are defined', () => {
      // Arrange
      const target = TargetClass;

      // Act
      const executeHooks = addHookFunction(target, HOOK_KEY);
      const results = executeHooks('test');

      // Assert
      expect(results).toEqual([]);
    });

    it('should handle multiple arguments', () => {
      // Arrange
      const target = TargetClass;
      const hookFn = jest.fn((x, y) => x + y);
      Reflect.defineMetadata(HOOK_KEY, [hookFn], target);

      // Act
      const executeHooks = addHookFunction(target, HOOK_KEY);
      const results = executeHooks(5, 3);

      // Assert
      expect(hookFn).toHaveBeenCalledWith(5, 3);
      expect(results).toEqual([8]);
    });

    it('should execute multiple hooks in order', () => {
      // Arrange
      const target = TargetClass;
      const executionOrder: number[] = [];
      const hookFn1 = jest.fn(() => executionOrder.push(1));
      const hookFn2 = jest.fn(() => executionOrder.push(2));
      const hookFn3 = jest.fn(() => executionOrder.push(3));
      Reflect.defineMetadata(HOOK_KEY, [hookFn1, hookFn2, hookFn3], target);

      // Act
      const executeHooks = addHookFunction(target, HOOK_KEY);
      executeHooks();

      // Assert
      expect(executionOrder).toEqual([1, 2, 3]);
    });

    it('should maintain separate hooks for different metadata keys', () => {
      // Arrange
      const target = TargetClass;
      const HOOK_KEY_1 = 'test:hook:1';
      const HOOK_KEY_2 = 'test:hook:2';
      const hookFn1 = jest.fn(() => 'hook1');
      const hookFn2 = jest.fn(() => 'hook2');

      Reflect.defineMetadata(HOOK_KEY_1, [hookFn1], target);
      Reflect.defineMetadata(HOOK_KEY_2, [hookFn2], target);

      // Act
      const executeHooks1 = addHookFunction(target, HOOK_KEY_1);
      const executeHooks2 = addHookFunction(target, HOOK_KEY_2);

      const results1 = executeHooks1();
      const results2 = executeHooks2();

      // Assert
      expect(results1).toEqual(['hook1']);
      expect(results2).toEqual(['hook2']);
    });
  });
});
