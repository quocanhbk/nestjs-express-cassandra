import { AfterDelete } from '../../../../lib/orm/decorators/listeners/after-delete.decorator';
import { AFTER_DELETE } from '../../../../lib/orm/orm.constant';
import { getOptions } from '../../../../lib/orm/utils/decorator.utils';

describe('@AfterDelete', () => {
  it('should add after_delete hook to options', () => {
    // Arrange & Act
    class TestClass {
      @AfterDelete()
      afterDelete() {}
    }

    // Assert
    const options = getOptions(TestClass.prototype);
    expect(options.after_delete).toBeDefined();
    expect(typeof options.after_delete).toBe('function');
  });

  it('should execute hook method after delete', () => {
    // Arrange
    const mockInstance = { value: 0 };

    class TestClass {
      @AfterDelete()
      afterDelete() {
        mockInstance.value++;
      }
    }

    // Act
    const options = getOptions(TestClass.prototype);
    options.after_delete(mockInstance);

    // Assert
    expect(mockInstance.value).toBe(1);
  });

  it('should execute multiple hooks in order of declaration', () => {
    // Arrange
    const executionOrder: number[] = [];

    class TestClass {
      @AfterDelete()
      firstHook() {
        executionOrder.push(1);
      }

      @AfterDelete()
      secondHook() {
        executionOrder.push(2);
      }

      @AfterDelete()
      thirdHook() {
        executionOrder.push(3);
      }
    }

    // Act
    const options = getOptions(TestClass.prototype);
    options.after_delete({});

    // Assert
    expect(executionOrder).toEqual([1, 2, 3]);
  });

  it('should maintain hook metadata in Reflect', () => {
    // Arrange & Act
    class TestClass {
      @AfterDelete()
      afterDelete() {}
    }

    // Assert
    const hooks = Reflect.getMetadata(AFTER_DELETE, TestClass.prototype);
    expect(Array.isArray(hooks)).toBe(true);
    expect(hooks.length).toBe(1);
    expect(typeof hooks[0]).toBe('function');
  });

  it('should not override existing hooks when adding new ones', () => {
    // Arrange
    const mockInstance = { count: 0 };

    class TestClass {
      @AfterDelete()
      firstHook() {
        mockInstance.count++;
      }

      @AfterDelete()
      secondHook() {
        mockInstance.count++;
      }
    }

    // Act
    const options = getOptions(TestClass.prototype);
    options.after_delete(mockInstance);

    // Assert
    expect(mockInstance.count).toBe(2);
  });

  it('should handle hooks that throw errors', () => {
    // Arrange
    const mockInstance = { value: 0 };

    class TestClass {
      @AfterDelete()
      firstHook() {
        throw new Error('Hook error');
      }

      @AfterDelete()
      secondHook() {
        mockInstance.value++;
      }
    }

    // Act & Assert
    const options = getOptions(TestClass.prototype);
    expect(() => options.after_delete(mockInstance)).toThrow('Hook error');
    expect(mockInstance.value).toBe(0); // Second hook shouldn't execute after error
  });

  it('should handle multiple classes with after delete hooks independently', () => {
    // Arrange
    const log: string[] = [];

    class FirstClass {
      @AfterDelete()
      afterDelete() {
        log.push('first');
      }
    }

    class SecondClass {
      @AfterDelete()
      afterDelete() {
        log.push('second');
      }
    }

    // Act
    const firstOptions = getOptions(FirstClass.prototype);
    const secondOptions = getOptions(SecondClass.prototype);

    firstOptions.after_delete({});
    secondOptions.after_delete({});

    // Assert
    expect(log).toEqual(['first', 'second']);
  });
});
