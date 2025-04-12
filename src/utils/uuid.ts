import { v5 as uuidv5 } from 'uuid';
import { CONFIG } from '../config';

function generateUUIDv5(name: string, namespace: string = CONFIG.uuidNameSpace): string {
  const id = uuidv5(name, namespace);
  return id;
}

export default generateUUIDv5;
