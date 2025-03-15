const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    // 关闭 ESLint 检查（如果有需要）
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            new (require('webpack')).DefinePlugin({
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
            })
        ]
    }
    
});