import { Logger } from '@nestjs/common';
import { Connection } from '../../lib/orm/interfaces';
import * as decoratorUtils from '../../lib/orm/utils/decorator.utils';
import { getSchema, loadModel } from '../../lib/orm/utils/model.utils';

jest.mock('@nestjs/common', () => ({
  Logger: {
    error: jest.fn(),
  },
}));

describe('Model utils', () => {
  let mockConnection: Connection;
  let mockModel: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock model with syncDB method
    mockModel = {
      syncDB: jest.fn(),
    };

    // Mock connection with loadSchema method
    mockConnection = {
      loadSchema: jest.fn().mockReturnValue(mockModel),
    } as any;

    // Mock decorator utils
    jest.spyOn(decoratorUtils, 'getAttributes');
    jest.spyOn(decoratorUtils, 'getEntityName');
    jest.spyOn(decoratorUtils, 'getOptions');
  });

  describe('loadModel', () => {
    class TestEntity {}

    it('should load schema and sync database successfully', async () => {
      // Arrange
      const entityName = 'TestModel';
      (decoratorUtils.getEntityName as jest.Mock).mockReturnValue(entityName);
      mockModel.syncDB.mockImplementation(cb => cb(null));

      // Act
      const result = await loadModel(mockConnection, TestEntity);

      // Assert
      expect(decoratorUtils.getEntityName).toHaveBeenCalledWith(TestEntity);
      expect(mockConnection.loadSchema).toHaveBeenCalledWith(
        entityName,
        expect.any(Object),
      );
      expect(mockModel.syncDB).toHaveBeenCalled();
      expect(result).toBe(mockModel);
      expect(Logger.error).not.toHaveBeenCalled();
    });

    it('should handle syncDB error and log it', async () => {
      // Arrange
      const error = new Error('Sync failed');
      mockModel.syncDB.mockImplementation(cb => cb(error));

      // Act
      const result = await loadModel(mockConnection, TestEntity);

      // Assert
      expect(Logger.error).toHaveBeenCalledWith(
        error.message,
        error.stack,
        'ExpressCassandraModule',
      );
      expect(result).toBe(mockModel);
    });
  });

  describe('getSchema', () => {
    class TestEntity {}

    it('should create schema with attributes and options', () => {
      // Arrange
      const mockAttributes = {
        name: { type: 'text' },
        age: { type: 'int' },
      };
      const mockOptions = {
        instanceMethods: {
          someMethod: () => {},
        },
        classMethods: {
          someStaticMethod: () => {},
        },
        timestamps: true,
        saveUnknown: false,
      };

      (decoratorUtils.getAttributes as jest.Mock).mockReturnValue(
        mockAttributes,
      );
      (decoratorUtils.getOptions as jest.Mock).mockReturnValue(mockOptions);

      // Act
      const schema = getSchema(TestEntity);

      // Assert
      expect(schema).toEqual({
        timestamps: true,
        saveUnknown: false,
        fields: mockAttributes,
      });
      expect(schema).not.toHaveProperty('instanceMethods');
      expect(schema).not.toHaveProperty('classMethods');
    });

    it('should handle empty attributes and options', () => {
      // Arrange
      (decoratorUtils.getAttributes as jest.Mock).mockReturnValue({});
      (decoratorUtils.getOptions as jest.Mock).mockReturnValue({});

      // Act
      const schema = getSchema(TestEntity);

      // Assert
      expect(schema).toEqual({
        fields: {},
      });
    });

    it('should get attributes from entity prototype', () => {
      // Arrange
      class TestEntity {}

      // Act
      getSchema(TestEntity);

      // Assert
      expect(decoratorUtils.getAttributes).toHaveBeenCalledWith(
        TestEntity.prototype,
      );
    });

    it('should get options from entity prototype', () => {
      // Arrange
      class TestEntity {}

      // Act
      getSchema(TestEntity);

      // Assert
      expect(decoratorUtils.getOptions).toHaveBeenCalledWith(
        TestEntity.prototype,
      );
    });

    it('should merge complex options correctly', () => {
      // Arrange
      const mockAttributes = {
        id: { type: 'uuid', default: { $db_function: 'uuid()' } },
      };
      const mockOptions = {
        instanceMethods: { method1: () => {} },
        classMethods: { method2: () => {} },
        timestamps: true,
        clusteringOrder: { createdAt: 'desc' },
        indexes: ['name'],
      };

      (decoratorUtils.getAttributes as jest.Mock).mockReturnValue(
        mockAttributes,
      );
      (decoratorUtils.getOptions as jest.Mock).mockReturnValue(mockOptions);

      // Act
      const schema = getSchema(TestEntity);

      // Assert
      expect(schema).toEqual({
        timestamps: true,
        clusteringOrder: { createdAt: 'desc' },
        indexes: ['name'],
        fields: mockAttributes,
      });
    });
  });
});
