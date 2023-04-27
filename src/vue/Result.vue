<template>
    <div class="panel result">
        <div class="row">
            <div class="float-left" id="identicon"></div>
            <div class="col">
                <template v-for="addr in result">

                <div :key="addr.address">Address: <span class="output" v-text="addr.address"></span></div>
                <div  :key="addr.privKey">
                        Private key:
                        <span
                            class="output"
                            v-text="addr.privKey"
                          
                        ></span>
                    </div>

                </template>
            </div>
            <div class="col-lg-2 col-12">
                <button data-remodal-target="modal" class="save button-large" :disabled="this.result.length==0">
                    <i class="icon-lock"></i>&nbsp;&nbsp;&nbsp;Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as blockies from 'blockies';

    export default {
        props: {
            address: String,
            privateKey: String,
            result: Array
        },
        data: function () {
            return {
                reveal: false,
            };
        },
        watch: {
            result: {
                handler() {
                    
                }
                
            },
            address(addr) {
                this.reveal = false;
                const id = document.getElementById('identicon');
                id.innerHTML = '';
                if (addr) {
                    id.appendChild(blockies({ seed: addr.toLocaleLowerCase(), scale: 6 }));
                }
            },
        },
        methods: {
            revealKey() {
                this.reveal = true;
            },
            to_address(addr) {
                this.reveal = false;
                const id = document.getElementById('identicon');
                id.innerHTML = '';
                if (addr) {
                    id.appendChild(blockies({ seed: addr.toLocaleLowerCase(), scale: 6 }));
                }
            },
        },
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    #identicon
        width: 48px
        height: 48px
        margin: 0 15px
        background-color: $panel-background-alt

    .output
        font-family: $monospace-font
        color: $text-alt
        margin-left: 15px
        word-break: break-all
        font-size: 15px

    .panel > div:not(:last-child)
        margin-bottom: 15px

    .save
        margin-top: 30px

    @media screen and (min-width: 992px)
        .save
            margin-top: 0
</style>
