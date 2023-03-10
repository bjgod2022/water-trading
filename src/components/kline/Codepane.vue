<template>
    <div class="code-pane" :style="{
        background: colors.back,
        borderColor: colors.border,
        width: width + 'px',
        height: height + 'px',
        top: `calc(50% - ${height / 2 + 20}px)`,
        left: `calc(50% - ${width / 2}px)`,
        boxShadow: `0 0 15px 1px ${colors.shadow || '#0b0e145e'}`
    }">
        <codemirror v-model="code" :options="options" @input="on_change" ref="cm" />
        <span class="close thick code-close" @click="$emit('close-code')"></span>
    </div>
</template>

<script>

import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'

export default {
    name: 'Codepane',
    components: {
        codemirror
    },
    props: ['colors', 'height', 'width', 'bundle', 'src'],
    mounted () {
        this.reset_style()
    },
    computed: {
        style () {
            return `
                .CodeMirror {
                    height: ${this.$props.height}px !important;
                }
                .cm-s-dracula.CodeMirror,
                .cm-s-dracula
                .CodeMirror-gutters {
                    background-color: ${this.$props.colors.cmBack} !important;
                    color: ${this.$props.colors.cmCode} !important;
                }
                .cm-property {
                    color: ${this.$props.colors.cmProperty} !important;
                }
                .cm-s-dracula .CodeMirror-linenumber {
                    color: ${this.$props.colors.cmLineNumber};
                }
                .cm-comment {
                    color: ${this.$props.colors.cmComment} !important;
                }
                .cm-attribute {
                    color: ${this.$props.colors.cmAttribute} !important;
                }
                .cm-tag,
                .cm-keyword {
                    color: ${this.$props.colors.cmKeyword} !important;
                }
                .CodeMirror-cursor {
                    border-left: solid thin ${this.$props.colors.text} !important;
                }
                .CodeMirror-selected {
                    background: ${this.$props.colors.selection} !important;
                }
            `
        }
    },
    methods: {
        reset_style () {
            var stbr = document.getElementById('code-mirror-custom')
            if (stbr) {
                var sheetParent = stbr.parentNode
                sheetParent.removeChild(stbr)
            }


            var sheet = document.createElement('style')
            sheet.setAttribute("id", "code-mirror-custom");
            sheet.innerHTML = this.style
            document.body.appendChild(sheet)
        },
        on_change (text) {
            this.$emit('src-changed', text)
        },
    },
    watch: {
        width () {
            if (!this.$refs.cm) return
            this.$refs.cm.refresh()
        },
        colors () {
            this.reset_style()
        }
    },
    data () {
        return {
            code: this.$props.src,
            options: {
                mode: 'text/javascript',
                tabSize: 4,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                foldGutter: true,
                styleSelectedText: true,
                runmode: 'colorize',
                matchBrackets: true,
                showCursorWhenSelecting: true,
                theme: "dracula",
                extraKeys: {
                    "Ctrl": "autocomplete"
                },
                hintOptions: {
                    completeSingle: false
                },
                scrollbarStyle: 'simple'
            }
        }
    }
}
</script>

<style>
.code-pane {
    position: absolute;
    height: 100%;
    border: 1px solid;
    z-index: 200;
}

.CodeMirror {
    font-size: 14px;
}

.cm-tag,
.cm-keyword {
    /*color: #dddcdc !important;*/
    /*color: #e27777 !important;*/
    color: #6dc59f !important;
}

.cm-variable,
.cm-variable-2,
.cm-def {
    /*color: #50fa7b !important;*/
    color: #3b9e64 !important;
    /* specific keyword #d0ca95 */
}

.cm-string {
    color: #9faabb !important;
}

.cm-string-2 {
    color: #9faabb !important;
}

.cm-operator {
    color:
        /*#e54150*/
        #9a9a9a !important;
}

.cm-property {
    color: #35a776 !important;
}

.cm-number {
    color: #fbab66 !important;
}

.cm-comment {
    color: #9098af63 !important;
}

.cm-s-dracula.CodeMirror,
.cm-s-dracula .CodeMirror-gutters {
    background-color:
        /*#121827*/
        #1b202dfa !important;
}

.CodeMirror-simplescroll-vertical,
.CodeMirror-simplescroll-horizontal {
    background: none;
}

.CodeMirror-simplescroll-horizontal div,
.CodeMirror-simplescroll-vertical div {
    border-radius: 20px;
    border: none;
    background: #7b7b7b;
    opacity: 0.35;
    right: 1px;
}

.CodeMirror-simplescroll-horizontal div:hover,
.CodeMirror-simplescroll-vertical div:hover {
    filter: brightness(1.5);
}

.CodeMirror-scrollbar-filler,
.CodeMirror-gutter-filler {
    background: none;
}

.CodeMirror-simplescroll-horizontal {
    bottom: 3px;
}

.code-close {
    z-index: 1001;
    right: 10px;
    top: 10px;
    position: absolute !important;
    cursor: pointer;
    opacity: 0.75;
}

.code-close:hover {
    opacity: 1;
}

.close {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
    overflow: hidden;
}

.close:hover::before,
.close:hover::after {}

.close::before,
.close::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    top: 50%;
    left: 0;
    margin-top: -1px;
    background: #88888888;
}

.close::before {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}

.close::after {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.close.big {
    -webkit-transform: scale(3);
    -moz-transform: scale(3);
    -ms-transform: scale(3);
    -o-transform: scale(3);
    transform: scale(3);
}

.close.thick::before,
.close.thick::after {
    height: 2px;
    margin-top: -2px;
}
</style>
