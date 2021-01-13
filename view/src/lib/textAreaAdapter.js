import diff_match_patch, {} from 'diff-match-patch';
import {TextOperation, Selection} from '.'
import {applyOperation} from '../features/text-area/textAreaSlice';

/**
 * 构造TextOperation和Inverse操作
 * @param {string} oldStr
 * @param {string} newStr
 * @returns {TextOperation, TextOperation} {textOperation, inverse}
 */
const operationBuilder = (oldStr, newStr, pendingOperationQueue) => {
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
  // 3. has pending operation
  if (pendingOperationQueue.length !== 0) {
    var transform = textOperation.constructor.transform;
    for (var i = 0; i < pendingOperationQueue.length; i++) {
      textOperation = transform(textOperation, pendingOperationQueue[i])[0];
    }
  }
  // TODO: test condition，delete in the production env
  if (textOperation.apply(oldStr) !== newStr) {
    throw new Error("TextOperation Build Fail!");
  }
  const inverse = textOperation.invert(oldStr);
  return {textOperation, inverse};
};

/**
 * TextArea和OT的适配器
 */
function TextAreaAdapter(storeAPI) {
  this.dispatch = storeAPI.dispatch;
  this.getState = storeAPI.getState;
  this.callbacks = {};    
};

/**
 * EditClient通过这个方法注册处理函数
 * @param {Object<String, Function>}} callbacks 
 */
TextAreaAdapter.prototype.registerCallbacks = function(callbacks) {
    this.callbacks = callbacks;
}

TextAreaAdapter.prototype.registerUndo = function(cb) {
  this.callbacks['undo'] = cb;
}

TextAreaAdapter.prototype.registerRedo = function(cb) {
  this.callbacks['redo'] = cb;
}

TextAreaAdapter.prototype.onChange = function(oldValue, newValue, pendingOperationQueue) {
    const {textOperation, inverse} = operationBuilder(oldValue, newValue, pendingOperationQueue);
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

TextAreaAdapter.prototype.applyOperation = function(operation) {
  // TODO: optimize this with middleware
  this.dispatch({
    type: 'OT_APPLY_OPERATION',
    payload: operation
  });
}

/**
 * todo
 */
TextAreaAdapter.prototype.getSelection = function() {
  return new Selection([new Selection.Range(0, 0)]);
}

TextAreaAdapter.prototype.updateSelection = function() {
  // todo
}

TextAreaAdapter.prototype.setOtherSelection = function() {
  // todo
}

export default TextAreaAdapter;