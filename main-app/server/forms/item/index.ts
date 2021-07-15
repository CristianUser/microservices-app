import FormComposer from '../../services/FormComposer';
import itemSchema from './schema.json';

class ItemForm extends FormComposer {
  async build() {
    const foundReferences = this.findReferences(itemSchema);
    await this.resolveReferences(foundReferences, itemSchema);

    return itemSchema;
  }
}

export default ItemForm;
