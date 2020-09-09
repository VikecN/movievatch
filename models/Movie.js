function Movie(imdbID, Title, Genre, Plot, Writer, Rated, Director, Actors, Production, Year, Released, Runtime, Type, Poster, Ratings, WatchedStatus) { 
    this.imdbID = imdbID;
    this.Title = Title;
    this.Genre = Genre;
    this.Plot = Plot,
    this.Writer = Writer;
    this.Rated = Rated;
    this.Director = Director;
    this.Actors = Actors;
    this.Production = Production;
    this.Year = Year;
    this.Released = Released;
    this.Runtime = Runtime;
    this.Type = Type;
    this.Poster = Poster;
    this.Ratings = Ratings;
    this.WatchedStatus = WatchedStatus
 }

module.exports = Movie
