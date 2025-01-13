import Post from '../models/Post.js'

class PostService {
	async getAll(){
		const posts = await Post.find()
		return posts
	}
	async getOne(id){
		if (!id) {
			throw new Error('Id не был передан')
		}
		const post = await Post.findById(id)
		return post
	}
	async create(post){
		if (!post) {
			throw new Error('Данные не были переданы')
		}
		const createdPost = await Post.create(post)
		return createdPost
	}
	async delete(id){
		if (!id) {
			throw new Error('Id не был передан')
		}
		const post = await Post.findByIdAndDelete(id)
		return post
	}
	async update(post){
		if (!post._id) {
			throw new Error('Id не был передан')
		}
		const updatedPost = await Post.findByIdAndUpdate(post._id, post)
		return updatedPost
	}
}

export default new PostService()