import { searchSimilarChunks, getEmbedding } from '../rag/vectorService';
import { FallbackStore } from '../services/fallbackStore';

describe('RAG Retrieval Logic', () => {
  beforeAll(async () => {
    // Seed fallback store
    await FallbackStore.initialize();
    
    // Generate vectors for tests dynamically to guarantee exact similarity matching
    const queryVector = await getEmbedding('wheelchair ramp');
    const oppositeVector = queryVector.map(x => -x);

    // Add custom chunks
    FallbackStore.documentChunks.push(
      {
        id: 'test-chunk-1',
        documentType: 'test_policy',
        chunkText: 'Ramp width should be at least 1200mm for wheelchairs.',
        metadata: { source: 'standard' },
        embedding: queryVector, // Identical to query, cosine similarity = 1.0
      },
      {
        id: 'test-chunk-2',
        documentType: 'test_policy',
        chunkText: 'Elevators must support audio directions for blind guests.',
        metadata: { source: 'standard' },
        embedding: oppositeVector, // Opposite to query, cosine similarity = -1.0
      }
    );
  });

  test('should return matched chunks filtered by documentType', async () => {
    const results = await searchSimilarChunks('wheelchair ramp', 'test_policy', 5);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.documentType === 'test_policy')).toBe(true);
  });

  test('should sort chunks by vector cosine similarity correctly', async () => {
    const results = await searchSimilarChunks('wheelchair ramp', 'test_policy', 1);
    
    expect(results[0].id).toBe('test-chunk-1'); // Closer vector should be ranked first
    expect(results[0].chunkText).toContain('Ramp width');
  });
});
