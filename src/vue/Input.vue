<template>
    <div class="panel" id="input-panel">
        <form :class="{ error: inputError }" @submit.prevent="startGen">
            <!--前缀-->
            <div class="error-text">Numbers and letters from A to F only</div>
            <input type="number" class="text-input-large" id="input_1" placeholder="开头匹配位数" v-model="hex_1"
                :disabled="running" />
            <!--添加新的输入框输入后缀-->
            <div class="error-text">Numbers and letters from A to F only</div>
            <input type="number" class="text-input-large" id="input_2" placeholder="结尾匹配位数" v-model="hex_2"
                :disabled="running" />
            <!--添加新的输入框输入后缀-->
            <div class="error-text">Numbers and letters from A to F only</div>
            <textarea class="text-input-large" id="add_1" placeholder="输入ETH地址,每行一个" v-model="add_1"
                :disabled="running"></textarea>
            <!--添加结束-->
            <div class="row justify-content-center hide-render">
                <div class="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            
            <div class="row controls hide-prerender">
                <!--区分大小写-->
                <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                    <label class="checkbox">
                        <input type="checkbox" name="checkbox" checked="" v-model="checksum" :disabled="running" />
                        <i class="left"> </i>
                        Case-sensitive
                    </label>
                </div>
                <!--选择前后缀，取消-->

                <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                    
                </div>

            </div>
            <!--线程-->
            <div class="threads hide-prerender">
                <input type="button" class="square-btn button-large" value="-" @click="threads--"
                    :disabled="running || threads <= 1" />
                <input type="button" class="square-btn arrow button-large" value="+" @click="threads++"
                    :disabled="running" />
                <h4 v-text="threads"></h4>
                <span>&nbsp;threads</span>
                <span v-if="threads === cores"> (recommended)</span>
            </div>
            <div class="row">
                <!--开始-->
                <div class="col-lg-6 col-sm-12">
                    <input type="button" value="Generate" class="button-large hide-render" disabled />
                    <input type="button" value="Generate" class="button-large hide-prerender" @click="startGen"
                        :disabled="running || inputError || error" />
                </div>
                <!--停止-->
                <div class="col-lg-6 col-sm-12">
                    <input type="button" value="Stop" class="button-large" @click="stopGen" :disabled="!running" />
                </div>
            </div>
        </form>
    </div>
</template>

<script>
// const isValidHex = function (hex) {
//     return hex.length ? /^[0-9A-F]+$/g.test(hex.toUpperCase()) : true;
// };

// function mixCase(str) {
//     let ret = '';
//     for (let i = 0; i < str.length; i++) {
//         const l = str.substr(i, 1);
//         ret += Math.random() < 0.5 ? l.toUpperCase() : l.toLowerCase();
//     }
//     return ret;
// }
export default {
    props: {
        running: Boolean,
        cores: Number,
    },
    data: function () {
        return {
            threads: this.$props.cores || 4,
            hex_1: '',
            hex_2: '',
            add_1: '',
            checksum: true,
            error: false,
        };
    },
    computed: {
        inputError: function () {
            return false;//!isValidHex(this.hex_1);
        },
    },
    methods: {
        startGen: function () {
            if (!this.running && !this.inputError && !this.error) {
                this.$emit('start');
            }
        },
        stopGen: function () {
            this.$emit('stop');
        },
    },
    watch: {
        hex_1: function () {
            this.$emit('input-change', 'hex_1', this.hex_1);
        },
        hex_2: function () {
            this.$emit('input-change', 'hex_2', this.hex_2);
        },
        add_1: function () {
            this.$emit('input-change', 'add_1', this.add_1);
        },
        checksum: function () {
            this.$emit('input-change', 'checksum', this.checksum);
        },
        
        threads: function () {
            this.$emit('input-change', 'threads', this.threads);
        },
    },
};
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel
        min-height: 280px

    .error-text
        display: none
        font-size: 14px
        color: $error

    .error
        input[type="text"]
            border: 1px solid $error
        .error-text
            display: block

    .example
        font-size: 14px
        word-break: break-all
        color: $text-alt
        b
            color: $text
        .monospace
            font-family: $monospace-font
    .controls
        margin: 12px 0
        > div
            padding: 5px 0

        .checkbox
            margin-bottom: 4px
            padding-left: 30px
            line-height: 27px
            cursor: pointer
            position: relative
            color: $text
            font-weight: 400
            &:last-child
                margin-bottom: 0
            i
                position: absolute
                bottom: 4px
                left: 17.5em
                display: block
                width: 19px
                height: 19px
                outline: none
                border: 1px solid $border-grey
                &.left
                    position: absolute
                    bottom: 4px
                    left: 0
                    display: block
                    width: 19px
                    height: 19px
                    outline: none
                    border: 1px solid $border-grey
            input
                + i:after
                    content: ''
                    background: url("../assets/images/tick-mark.png") no-repeat
                    top: 4px
                    left: 3px
                    width: 15px
                    height: 15px
                    position: absolute
                    opacity: 0
                position: absolute
                left: -9999px
                &:checked + i:after
                    opacity: 1

        .switch
            position: relative
            width: 40px
            height: 24px
            margin: 0 5px
            input
                visibility: hidden

        .slider
            position: absolute
            cursor: pointer
            top: 0
            left: 0
            right: 0
            bottom: 0
            background-color: $primary
            transition: .2s
            &:before
                position: absolute
                content: ""
                height: 16px
                width: 16px
                left: 4px
                bottom: 4px
                background-color: white
                transition: .2s

    input
        &:checked + .slider
            background-color: $primary
        &:focus + .slider
            box-shadow: 0 0 1px $primary
        &:checked + .slider:before~
            transform: translateX(16px)

    .threads
        h4
            display: inline
        input[type=button].square-btn
            display: inline-block
            width: 24px
            height: 24px
            margin: 0 5px 2px 0
            padding: 0
            line-height: 1em

    .justify-content-center
        justify-content: center

    .spinner
        width: 64px
        height: 64px
        margin: 18px
        & > div
            position: absolute
            width: 51px
            height: 51px
            margin: 6px
            border: 6px solid $primary
            border-radius: 50%
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
            border-color: $primary transparent transparent transparent
            &:nth-child(1)
                animation-delay: -0.45s
            &:nth-child(2)
                animation-delay: -0.3s
            &:nth-child(3)
                animation-delay: -0.15s

    @keyframes lds-ring
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
