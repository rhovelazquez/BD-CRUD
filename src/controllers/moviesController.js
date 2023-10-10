const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ["genre"] // en los metodos find podemos incluir la relacionq que tine con otra tabla
        })
            .then(movies => {
                // res.json(movies[0]) podemos ver que nos trae el genero 
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
            .then(function (allGenres){
                return res.render('moviesAdd',{allGenres})
            })
    },
    create: async function (req,res) {
        const Movie= await db.Movie.create(req.body);
        console.log(Movie);
        res.redirect('/movies');
    },
    edit: async function(req,res) {
        await db.Movie.findByPk(req.params.id)
            .then( async function(Movie) {
                await db.Genre.findAll()
                    .then(function(allGenres) {
                        return res.render('moviesEdit',{
                            allGenres: allGenres,
                            Movie: Movie
                        })
                    })
            })
    },
    update: async function (req,res) {
        const Movie= await db.Movie.update(req.body,{where: {id:req.params.id}})
        console.log(Movie);
        res.redirect('/movies');
    },
    delete: async function (req,res) {
        await db.Movie.findByPk(req.params.id)
        .then( function (Movie) {
           res.render('moviesDelete', {Movie})
        });
    },
    destroy: async function (req,res) {
        await db.Movie.destroy({where: {id: req.params.id}})
        .then( function (Movie) {
            res.redirect('/movies');
        })
    }
}

module.exports = moviesController;
// otra alternativa para editar y no hacer un chorizo de then
// async function(req, res) {
//     try {
//         const Movie = await db.Movie.findByPk(req.params.id);
//         const allGenres = await db.Genre.findAll();
        
//         res.render('moviesEdit', {
//             allGenres: allGenres,
//             Movie: Movie
//         });
//     } catch (error) {
//         // Manejo de errores aquí
//         console.error(error);
//         res.status(500).send('Error interno del servidor');
//     }
// }
