import { types } from 'cassandra-driver';
import {
  isTimeUuid,
  isUuid,
  timeuuid,
  uuid,
} from '../../lib/orm/utils/db.utils';

describe('Database utils', () => {
  describe('UUID functions', () => {
    describe('isUuid', () => {
      it('should return true for valid UUID instance', () => {
        // Arrange
        const validUuid = types.Uuid.random();

        // Act & Assert
        expect(isUuid(validUuid)).toBe(true);
      });

      it('should return false for non-UUID values', () => {
        // Arrange
        const invalidValues = ['not-a-uuid', 123, null, undefined, {}, []];

        // Act & Assert
        invalidValues.forEach(value => {
          expect(isUuid(value)).toBe(false);
        });
      });
    });

    describe('uuid', () => {
      it('should generate random UUID when no argument provided', () => {
        // Act
        const result = uuid();

        // Assert
        expect(result).toBeInstanceOf(types.Uuid);
        expect(isUuid(result)).toBe(true);
      });

      it('should create UUID from valid string', () => {
        // Arrange
        const validUuidString = '123e4567-e89b-12d3-a456-426614174000';

        // Act
        const result = uuid(validUuidString);

        // Assert
        expect(result).toBeInstanceOf(types.Uuid);
        expect(result.toString()).toBe(validUuidString);
      });

      it('should return the same UUID instance if one is provided', () => {
        // Arrange
        const existingUuid = types.Uuid.random();

        // Act
        const result = uuid(existingUuid);

        // Assert
        expect(result).toBe(existingUuid);
      });

      it('should throw error for invalid UUID string', () => {
        // Arrange
        const invalidUuidString = 'not-a-valid-uuid';

        // Act & Assert
        expect(() => uuid(invalidUuidString)).toThrow();
      });
    });
  });

  describe('TimeUUID functions', () => {
    describe('isTimeUuid', () => {
      it('should return true for valid TimeUUID instance', () => {
        // Arrange
        const validTimeUuid = types.TimeUuid.now();

        // Act & Assert
        expect(isTimeUuid(validTimeUuid)).toBe(true);
      });

      it('should return false for non-TimeUUID values', () => {
        // Arrange
        const invalidValues = [
          'not-a-timeuuid',
          123,
          null,
          undefined,
          {},
          [],
          types.Uuid.random(), // Even regular Uuid should return false
        ];

        // Act & Assert
        invalidValues.forEach(value => {
          expect(isTimeUuid(value)).toBe(false);
        });
      });
    });

    describe('timeuuid', () => {
      it('should generate TimeUUID for current time when no argument provided', () => {
        // Act
        const result = timeuuid();

        // Assert
        expect(result).toBeInstanceOf(types.TimeUuid);
        expect(isTimeUuid(result)).toBe(true);
      });

      it('should create TimeUUID from valid string', () => {
        // Arrange
        const validTimeUuidString = types.TimeUuid.now().toString();

        // Act
        const result = timeuuid(validTimeUuidString);

        // Assert
        expect(result).toBeInstanceOf(types.TimeUuid);
        expect(result.toString()).toBe(validTimeUuidString);
      });

      it('should create TimeUUID from Date object', () => {
        // Arrange
        const date = new Date();

        // Act
        const result = timeuuid(date);

        // Assert
        expect(result).toBeInstanceOf(types.TimeUuid);
        expect(result.getDate().getTime()).toBe(date.getTime());
      });

      it('should throw error for invalid TimeUUID string', () => {
        // Arrange
        const invalidTimeUuidString = 'not-a-valid-timeuuid';

        // Act & Assert
        expect(() => timeuuid(invalidTimeUuidString)).toThrow();
      });

      it('should create different TimeUUIDs for different dates', () => {
        // Arrange
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-12-31');

        // Act
        const result1 = timeuuid(date1);
        const result2 = timeuuid(date2);

        // Assert
        expect(result1.toString()).not.toBe(result2.toString());
        expect(result1.getDate().getTime()).toBe(date1.getTime());
        expect(result2.getDate().getTime()).toBe(date2.getTime());
      });
    });
  });
});
