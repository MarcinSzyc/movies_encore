import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import axios from "axios";
import Movie from "../models/movies.model"

chai.should();
chai.use(chaiHttp);

describe('endpoint tests', function () {
    let token:any;
    
    before(async function () {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:3000/auth',
                data: {
                    username: 'basic-thomas',
                    password: 'sR-_pcoow-27-6PAwCD8'
                }
            })
            token = response.data.token;
        } catch (err) {
            console.error('Error while connecting to auth server:' + err);
        }
    }) 

    // GET Movies
    describe('GET Movies', function () {
        it('It should return error due to lack of authorization token', function (done) {
            chai.request(app)
                .get('/movies')
                .then(function (res) {
                    res.should.have.status(401);
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        })

        it('It should return error due to invalid token', function (done) {
            chai.request(app)
                .get('/movies')
                .set({ Authorization: `Bearer ${token.slice(0,-1) + 'b'}` })
                .then(function (res) {
                    res.should.have.status(403);
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        })

        it('It should get all movies from database', function (done) {
            chai.request(app)
                .get('/movies')
                .set({ Authorization: `Bearer ${token}` })
                .then(function (res) {
                    res.should.have.status(200);
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        })
    })

    // POST Movies
    describe('POST Movies', () => {
        before(function () {
            Movie.deleteMany({}, () => {
                console.log('db clean');
            })
        })

        it('It should create new movie and save it to database', function (done) {
            chai.request(app)
                .post('/movies')
                .set({Authorization: `Bearer ${token}` })
                .send({movieName: 'test'})
                .then(function (res) {
                    res.should.have.status(200);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
            
        })

        it('It should return error due to invalid token', function (done) {
            chai.request(app)
                .post('/movies')
                .set({Authorization: `Bearer ${token.slice(0,-1) + 'b'}`})
                .send({movieName: 'test'})
                .then(function (res) {
                    res.should.have.status(403);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        })

        it('It should return error due to lack of authorization token', function (done) {
            chai.request(app)
                .post('/movies')
                .send({movieName: 'test'})
                .then(function (res) {
                    res.should.have.status(401);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        })

        it('It should return error due to no movie found', function (done) {
            chai.request(app)
                .post('/movies')
                .set({Authorization: `Bearer ${token}` })
                .send({movieName: 'tttittaniiccc'})
                .then(function (res) {
                    res.should.have.status(400);
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        })

        it('It should return error due to entry already found', async function (done) {
            const requester = chai.request(app).keepOpen();
            await requester.post('/movies').set({Authorization: `Bearer ${token}` }).send({movieName: 'Test'})

            requester.post('/movies')
                .set({Authorization: `Bearer ${token}` })
                .send({movieName: 'Test'})
                .then(function (res) {
                    res.should.have.status(400);
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        })

        it('It should return error due because of too many request made by user', async function (done) {
            before(async () => {
                Movie.deleteMany({}, () => {
                    console.log('db clean')
                })
            })
            
            const requester = chai.request(app).keepOpen();

            const movieList = [
                {movieName: 'Titanic', createdBy: 'testUser'},
                {movieName: 'Inception', createdBy: 'testUser'},
                {movieName: 'Castaway', createdBy: 'testUser'},
                {movieName: 'Tenet', createdBy: 'testUser'},
                {movieName: 'Matrix', createdBy: 'testUser'}
            ]

            for (const movie in movieList) {
                await requester.post('/movies').set({Authorization: `Bearer ${token}` }).send(movie);
            }

            requester.post('/movies')
                .set({Authorization: `Bearer ${token}` })
                .send({movieName: 'Interstellar', createdBy: 'testUser'})
                .then(function (res) {
                    res.should.have.status(400);
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        })
    })

    after(async function () {
        try {
            await Movie.deleteMany({title: "Test" });
            console.log('test data successfully removed');
        } catch (error) {
            console.log('App Tests: error while cleaning db' + error);
        } finally {
            process.exit();
        }
    })
})