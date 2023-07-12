const options = {method: 'GET', headers: { accept: 'application/json', Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzVmZDc1NGU5YzFiZWE4YjJkYmU0ZTU0ODFjNWYwMSIsInN1YiI6IjY0NjM4ZGJkZTNmYTJmMDBlNDA0YzUwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kG7Jo4s4wgu2Sv2ozD7kRwoipqLgGr8TmYzjoRQ1VxU'}};

document.getElementById("btnBuscar").addEventListener("click", getMovieName);
document.getElementById("nomeFilme").addEventListener("keypress", function(event){
    if(event.key === 'Enter'){
        getMovieName();
    }
});

function getMovieName(){
    if(document.querySelector("#nomeFilme").value != ""){      
        getData()
    } else {
        alert("Insira um filme!");
    }
}

async function getData() {
    const movieName = document.querySelector("#nomeFilme").value;
    const movies = document.querySelector(".filmes");
   
    movies.innerHTML = "";
    const results = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=pt-BR&page=1&region=BR`, options)
        .then(response => response.json())
        if(results.results != ""){
            results.results.map((movie) => {
                if(movie.overview != "" && movie.poster_path != null && movie.vote_average != 0){                  
                    loadMovies(movie);
                }              
            })
        } else {
            alert("Nenhum filme encontrado!");
        }   
}

async function loadMovies(movie){
    
    const movies = document.querySelector(".filmes");

        const poster = document.createElement('img');
        poster.setAttribute('class', 'poster-img');
        poster.setAttribute('loading', 'lazy');
        poster.setAttribute('alt', movie.title);
        poster.setAttribute('decoding', 'async');
        poster.setAttribute('fetchpriority', 'high');
        poster.setAttribute('src', 'https://image.tmdb.org/t/p/w342/' + movie.poster_path)
        poster.setAttribute('height', 230); 

        const div_poster = document.createElement('div');
        div_poster.setAttribute('class', 'div-img-poster');
        div_poster.append(poster);
        
        const title = document.createElement('h2');
        title.setAttribute('class', 'title');
        title.textContent = movie.title;

        const div_title = document.createElement('div-title');
        div_title.setAttribute('class', 'div-title');
        div_title.append(title);

        const span_year = document.createElement('span')
        span_year.setAttribute('class', 'year');
        span_year.textContent = movie.release_date.substr(0, 4);
        
        const year = document.createElement('p');
        year.setAttribute('class', 'sub');
        year.textContent = "Ano: ";
        year.append(span_year);

        const div_year = document.createElement('div');
        div_year.setAttribute('class', 'div-year');
        div_year.append(year);

        const span_gender = document.createElement('span');
        span_gender.setAttribute('class', 'gender');
        
        getGender(movie.genre_ids).then(genreList => {
            span_gender.textContent = genreList;
        });

        const gender = document.createElement('p');
        gender.setAttribute('class', 'sub')
        gender.textContent = "Gênero: ";
        gender.append(span_gender);

        const div_gender = document.createElement('div');
        div_gender.setAttribute('class', 'div-gender')
        div_gender.append(gender);

        const div_info = document.createElement('div-info');
        div_info.setAttribute('class', 'div-info')
        div_info.append(div_year);
        div_info.append(div_gender);

        const rating = document.createElement('p');
        rating.setAttribute('class', 'rating');
        rating.textContent = movie.vote_average.toFixed(1);

        const star_icon = document.createElement('img');
        star_icon.setAttribute('src', './img/star-icon.svg');
        star_icon.setAttribute('height', 15); 
        star_icon.setAttribute('width', 15); 

        const div_rating = document.createElement('div');
        div_rating.setAttribute('class', 'div-rating');
        div_rating.append(star_icon);
        div_rating.append(rating);

        const title_sinopse = document.createElement('p');
        title_sinopse.setAttribute('class', 'sub');
        title_sinopse.textContent = "Sinopse: ";

        const info_sinopse = document.createElement('div');
        info_sinopse.setAttribute('class', 'info-sinopse');
        info_sinopse.append(title_sinopse);
        info_sinopse.append(div_rating);

        const sinopse_text = document.createElement('span');
        sinopse_text.setAttribute('class', 'sinopse-text')
        sinopse_text.textContent = movie.overview

        const sinopse = document.createElement('div');
        sinopse.setAttribute('class', 'sinopse');
        sinopse.appendChild(sinopse_text);

        const div_sinopse = document.createElement('div');
        div_sinopse.setAttribute('class', 'div-sinopse')
        div_sinopse.append(info_sinopse);
        div_sinopse.append(sinopse);
     
        const actor = document.createElement('span');
        getActors(movie.id).then(actors => {
            actors.map((url) => {
                const actor_link = document.createElement('a');
                actor_link.setAttribute('class', 'actor-link');
                actor_link.setAttribute('href', 'https://www.imdb.com/search/name/?name=' + url);
                actor_link.setAttribute('target', '_blank');
                actor_link.textContent = url;
                actor.append(actor_link);
            })            
        })
        
        const div_actors = document.createElement('div');
        div_actors.setAttribute('class', 'div-actors')
        div_actors.append(actor);

        const title_cast = document.createElement('p');
        title_cast.setAttribute('class', 'sub');
        title_cast.textContent = 'Elenco: ';

        const div_cast = document.createElement('div');
        div_cast.setAttribute('class', 'div-cast');
        div_cast.append(title_cast);
        div_cast.append(div_actors);
        
        const title_streamings = document.createElement('p');
        title_streamings.setAttribute('class', 'sub');
        title_streamings.textContent = 'Onde Assistir: ';

        const streamings = document.createElement('div');
        streamings.setAttribute('class', 'streamings');
        getStreaming(movie.id, movie.title).then(streaming => {        
            if(streaming != undefined){               
                streaming.map((item) => {
                    streamings.innerHTML += item.innerHTML;                 
                })                
            } else {
                streamings.textContent = "Não está disponível para streaming!"
            }           
        })
        
        const div_streamings = document.createElement('div');
        div_streamings.setAttribute('class', 'div-streamings')
        div_streamings.append(title_streamings);
        div_streamings.append(streamings);

        const filme = document.createElement('div');
        filme.setAttribute('class', 'filme');
        filme.setAttribute('id', movie.id);
        filme.append(div_poster);
        filme.append(div_title);
        filme.append(div_info);
        filme.append(div_sinopse);
        filme.append(div_cast);
        filme.append(div_streamings);

        movies.append(filme)
}

async function getStreaming(movieId, title){
    
    const streamings = {
        'Netflix': {
            image: './img/Netflix.svg',
            link: 'https://www.netflix.com/search?q='
        },
        'HBO Max': {
            image: './img/hbo-max.svg',
            link: 'https://play.hbomax.com/search'
        },
        'Globoplay': {
            image: './img/globoplay.svg',
            link: 'https://globoplay.globo.com/'
        },
        'Amazon Prime Video': {
            image: './img/prime.svg',
            link: 'https://www.primevideo.com/'
        },
        'Disney Plus': {
            image: './img/disney-plus.svg',
            link: 'https://www.disneyplus.com/pt-br/search'
        },
        'Star Plus': {
            image: './img/star-plus.svg',
            link: 'https://www.starplus.com/pt-br/search'
        },
        'Telecine Play': {
            image: './img/telecine.svg',
            link: 'https://www.telecine.com.br/'
        },
        'Paramount Plus': {
            image: './img/paramount.svg',
            link: 'https://www.paramountplus.com/'
        },
        'Apple TV Plus': {
            image: './img/apple-tv.svg',
            link: 'https://tv.apple.com/'
        },
        'MUBI': {
            image: './img/mubi.svg',
            link: 'https://mubi.com/pt'
        },
        'NOW': {
            image: './img/claro.svg',
            link: 'https://www.clarotvmais.com.br/'
        }
    };

    const results = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, options)
        .then(response => response.json());

        if (results.results.BR && results.results.BR.flatrate && results.results.BR.flatrate != undefined) {
            const streamingList = results.results.BR.flatrate;
            const obj = [];         
            for (i in streamingList) {                      
                if (streamings[streamingList[i].provider_name]) {               
                    const logo_img = document.createElement('img');
                    logo_img.setAttribute('class', 'logo');
                    logo_img.setAttribute('loading', 'lazy');
                    logo_img.setAttribute('role', streamingList[i].provider_name);
                    logo_img.setAttribute('decoding', 'async');
                    logo_img.setAttribute('fetchpriority', 'high');
                    
                    logo_img.setAttribute('src', streamings[streamingList[i].provider_name].image);
                  
                    const logo_link = document.createElement('a');
                    logo_link.setAttribute('target', '_blank');
                    if(streamingList[i].provider_name == "Netflix"){
                        logo_link.setAttribute('href', streamings[streamingList[i].provider_name].link + title);
                    } else {
                        logo_link.setAttribute('href', streamings[streamingList[i].provider_name].link);
                    }
                    
                    logo_link.append(logo_img);

                    const div = document.createElement('div')
                    div.append(logo_link);
                  
                    obj.push(div);
                  }
            }           
            return obj;
        } 
}


async function getGender(genders){

    const gender = [
        {
            "id": 28,
            "name": "Ação"
        },
        {
            "id": 12,
            "name": "Aventura"
        },
        {
            "id": 16,
            "name": "Animação"
        },
        {
            "id": 35,
            "name": "Comédia"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentário"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Família"
        },
        {
            "id": 14,
            "name": "Fantasia"
        },
        {
            "id": 36,
            "name": "História"
        },
        {
            "id": 27,
            "name": "Terror"
        },
        {
            "id": 10402,
            "name": "Música"
        },
        {
            "id": 9648,
            "name": "Mistério"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Ficção científica"
        },
        {
            "id": 10770,
            "name": "Cinema TV"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
             "name": "Guerra"
        },
        {
            "id": 37,
            "name": "Faroeste"
        }
    ]

    let objGenders = [];

    for(let i = 0; i < genders.length; i++){
        for(let j = 0; j < gender.length; j++){
            if(genders[i] == gender[j].id){              
                if(objGenders.length < 3){
                    objGenders.push(gender[j].name)
                } else {
                    break;
                }
            }
        }
    }
    const gendersConcatenated = objGenders.join(", ");
    return gendersConcatenated;
    
}

async function getActors(id) {
 
    const results = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`, options)
        .then(response => response.json())
        const cast = results.cast;

        const obj = [];
        
        if(cast.length > 6){
            for(let i = 0; i < 6; i++){      
                obj.push(cast[i].name);
            }
        } else {
            for(let i = 0; i < cast.length; i++){
                obj.push(cast[i].name);  
            }
        }
        return obj;
}


