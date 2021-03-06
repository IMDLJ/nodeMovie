var Movie = require('../models/movie')
var Category = require('../models/category')

//index page 进入首页
exports.index = function(req, res){
    //console.log('user is session:')
    //console.log(req.session.user)
    Category.find({})
            .populate({path:'movies', options: {limit: 6}})
            .exec(function(err, categories){
                if(err){
                    console.log(err)
                }
                res.render('index',{
                    title: "电影首页",
                    categories: categories
                })
            })
    // Movie.fetch(function(err, movies){
    //     if(err){
    //         console.log(err)
    //     }
    //     res.render('index',{
    //         title: "首页",
    //         movies:movies
    //     })
    // })
}

exports.search = function(req, res){
    var catId = req.query.cat
    var q = req.query.q
    var page = parseInt(req.query.p, 10) || 0
    var count = 6
    var index = page * count

    if(catId){
        Category.find({_id: catId})
                .populate({
                    path:'movies', 
                    select: 'title poster'
                    //options: {limit: 6, skip: index}
                })
                .exec(function(err, categories){
                    if(err){
                        console.log(err)
                    }
                    var category = categories[0] || {}
                    var movies = category.movies || []
                    var results = movies.slice(index, index + count)

                    res.render('results',{
                        title: "电影 结果列表页面",
                        keyword: category.name,
                        currentPage: (page+1),
                        query: 'cat=' + catId,
                        totalPage: Math.ceil(movies.length / count),
                        movies: results
                    })
                })
    }
    else{
        Movie.find({title: new RegExp(q + '.*', 'i')})
            .exec(function(err, movies){
                if(err){
                        console.log(err)
                }
                
                var results = movies.slice(index, index + count)

                res.render('results',{
                    title: "电影 结果列表页面",
                    keyword: q,
                    currentPage: (page+1),
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    }
}