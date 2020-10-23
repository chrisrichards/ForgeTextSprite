const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// http://webpack.github.io/docs/configuration.html
module.exports = {
	entry: './src/ModelViewer/App.ts',
	devtool: 'inline-source-map',
	mode: 'development',

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},

	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		new CopyPlugin({
			patterns: [
				{ from: 'src/css', to: 'css' }
			],
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: false
		}),
	],

	output: {
		filename: "js/model-viewer.js",
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'ModelViewer'
	},

	devServer: {
		host: "localhost",
		port: 8000,
		contentBase: './dist',
		disableHostCheck: true
	}
}