-- AlterEnum
-- Adds the Galpões, Máquinas and Embarcações categories, keeping OUTROS last.
ALTER TYPE "Category" ADD VALUE 'GALPAO' BEFORE 'OUTROS';
ALTER TYPE "Category" ADD VALUE 'MAQUINA' BEFORE 'OUTROS';
ALTER TYPE "Category" ADD VALUE 'EMBARCACAO' BEFORE 'OUTROS';
