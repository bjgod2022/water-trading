<template>
  <div class="wrapper">
    <el-card
      class="box-card"
      :style="{ width: visible ? '230px' : '0', opacity: visible ? '1' : '0' }"
    >
      <div slot="header" style="min-width: 200px">
        <span>字段配置</span>
        <span class="fr close-btn" @click="$emit('update:visible', false)"
          >×</span
        >
      </div>
      <div>
        <el-checkbox
          v-model="checkAll"
          label="a"
          :indeterminate="isIndeterminate"
          @change="selectAll"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="realList"
          class="check-list"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="item in dataArr"
            :key="item.prop"
            :label="item.prop"
            :disabled="item.prop == 'name'"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div class="footer" style="min-width: 200px">
        <el-button
          type="primary"
          size="small"
          :disabled="realList.length < 1"
          @click="confirm"
          >确定</el-button
        >
        <el-button size="small" @click="reset">重置</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
  
  <script>
export default {
  name: "KeySetting",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dataArr: {
      type: Array,
      default: () => [],
    },
    checkList: {
      type: Array,
      default: () => [],
    },
    defaultArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkAll: false,
      realList: [],
      isIndeterminate: true,
    };
  },
  watch: {
    checkList(val) {
      this.realList = val;
      if (val.length === this.dataArr.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      }
    },
  },
  // created() {
  //   this.confirm();
  // },
  methods: {
    // 全选按钮
    selectAll(val) {
      this.realList = val
        ? this.dataArr.map((item) => item.prop)
        : this.defaultArr;
      if (val) {
        this.isIndeterminate = false;
      } else {
        this.isIndeterminate = true;
      }
    },
    // el-checkbox选中事件
    handleCheckedChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.dataArr.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.dataArr.length;
    },
    // 点击确定
    confirm() {
      this.$emit("confirm", this.realList);
      this.$emit("update:visible", false);
    },
    // 点击重置
    reset() {
      this.realList = [...this.defaultArr];
      this.isIndeterminate = true;
      this.checkAll = false;
    },
    // 点击取消
    cancel() {
      this.realList = this.checkList;
      this.$emit("update:visible", false);
    },
  },
};
</script>
  