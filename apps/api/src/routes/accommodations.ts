import { Router } from 'express';
import { generateLetter, simplifyDocument } from '../controllers/accommodations';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateLetterSchema, simplifyDocumentSchema } from '../validators';

const router = Router();

router.post('/generate-letter', authenticate, validate(generateLetterSchema), generateLetter);
router.post('/simplify-document', authenticate, validate(simplifyDocumentSchema), simplifyDocument);

export default router;
