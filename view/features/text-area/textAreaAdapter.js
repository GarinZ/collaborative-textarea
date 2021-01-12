import diff_match_patch, {} from 'diff-match-patch';
import TextOperation from '../../lib/text-operation'

/**
 * 构造TextOperation和Inverse操作
 * @param {string} oldStr
 * @param {string} newStr
 * @returns {TextOperation, TextOperation} {textOperation, inverse}
 */
const operationBuilder = (oldStr, newStr) => {
  // 1. diff oldStr and newStr
  const diffMatchPatch = new diff_match_patch();
  const diff = diffMatchPatch.diff_main(oldStr, newStr);
  // 2. build TextOperation And 
  const textOperation = new TextOperation();
  for (let idx in diff) {
    const [operation, value] = diff[idx];
    if (operation == diff_match_patch.DIFF_EQUAL) {
      textOperation.retain(value.length);
    } else if (operation == diff_match_patch.DIFF_INSERT) {
      textOperation.insert(value);
    } else {
      textOperation.delete(value);
    }
  }
  // TODO: test condition
  if (textOperation.apply(oldStr) !== newStr) {
    throw new Error("TextOperation Build Fail!");
  }
  const inverse = textOperation.invert(oldStr);
  return {textOperation, inverse};
};

/**
 * TextArea和OT的适配器
 */
function TextAreaAdapter() {
    this.callbacks = {};    
};

/**
 * EditClient通过这个方法注册处理函数
 * @param {Object<String, Function>}} callbacks 
 */
TextAreaAdapter.prototype.registerCallbacks = function(callbacks) {
    this.callbacks = callbacks;
}

TextAreaAdapter.prototype.onChange = function(oldValue, newValue) {
    const {textOperation, inverse} = operationBuilder(oldValue, newValue);
    this.callbacks['change'](textOperation, inverse);
}

/**
 * not in use
 * @param {*} textOperation 
 * @param {*} invert 
 */
TextAreaAdapter.prototype.onBlur = function(textOperation, invert) {
    this.callbacks['blur']
}

/**
 * not in use
 * @param {*} textOperation 
 * @param {*} invert 
 */
TextAreaAdapter.prototype.onSelectionChange = function(textOperation, invert) {
    this.callbacks['selectionChange']
}

export default TextAreaAdapter;