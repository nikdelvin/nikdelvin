import React, { useState, useEffect } from 'react';
import { t } from 'ttag';

const PoketSpace = () => {

	const [galaxy, setGalaxy] = useState(null)
	const [sector, setSector] = useState(null)
	const [location, setLocation] = useState(null)

	var size = window.innerWidth/2

	function gaussianRand() {
		var rand = 0;
		for (var i = 0; i < 6; i += 1) {
			rand += Math.random();
		}
		return rand / 6;
	}

	function gaussianRandom(start, end) {
		return Math.floor(start + gaussianRand() * (end - start + 1));
	}

	function randomInteger(min, max) {
	  let rand = min - 0.5 + Math.random() * (max - min + 1);
	  return Math.round(rand);
	}

	function choisePlanetType() {
	  var num=Math.random()
	  if(num < 0.005) return "TerranWet"
	  else if(num < 0.01) return "Islands"
	  else if(num < 0.175) return "TerranDry"
	  else if(num < 0.34) return "NoAtmosphere"
	  else if(num < 0.505) return "GasGiant1"
	  else if(num < 0.67) return "GasGiant2"
	  else if(num < 0.835) return "IceWorld"
	  else return "LavaWorld"
	}

	function shuffle(array) {
	  let currentIndex = array.length,  randomIndex;
	  while (currentIndex != 0) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	}

	function genSector() {
		var sector = {type: "BlackHole", seed: randomInteger(0, 4294967295)}
		var starCount = 100*100
		var stars = [...Array(starCount)].map(()=>{return {
			type: "Star",
			seed: randomInteger(0, 4294967295),
			solarMass: randomInteger(0, 10000)/100,
			solarRadius: randomInteger(0, 10000)/100,
			solarLuminosity: randomInteger(0, 10000)/100,
			age: randomInteger(1, 1000),
			temp: randomInteger(1000, 100000)
		}})
		sector.stars = stars
		for (var star of sector.stars) {
			var planetCount = gaussianRandom(0, 12)
			var planets = [...Array(planetCount)].map(()=>{return {
				type: choisePlanetType(),
				seed: randomInteger(0, 4294967295),
				earthMass: randomInteger(0, 10000)/100,
				earthRadius: randomInteger(0, 10000)/100,
				earthSurface: randomInteger(0, 10000)/100,
				earthVolume: randomInteger(0, 10000)/100,
				dayTime: randomInteger(1, 1000),
				sunDistance: randomInteger(1, 1000),
				maxTemp: randomInteger(0, 1000),
				minTemp: randomInteger(0, 1000),
				bacila: randomInteger(0, 1),
				flora: randomInteger(0, 1),
				fauna: randomInteger(0, 1),
				water: randomInteger(0, 1)
			}})
			star.planets = planets
		}
		sector.playerStar = [gaussianRandom(80, 95), gaussianRandom(80, 95)]
		var ind = sector.stars[sector.playerStar[0]*sector.playerStar[1]].planets.length
		var playerPlanet = randomInteger(0, ind-1)
		sector.playerPlanet = [playerPlanet, randomInteger(0,360)]
		return sector
	}

	useEffect(() => {
		let sector = [gaussianRandom(80, 95), gaussianRandom(80, 95)]
		let galaxySeed = randomInteger(0, 4294967295)
		setGalaxy({type: "Galaxy", seed: galaxySeed, playerSector: sector})
		setSector(genSector())
	}, [])

	if ((location == null) && (sector != null)) {
		setLocation({way: [], target: { type: sector.stars[sector.playerStar[0]*sector.playerStar[1]].planets[sector.playerPlanet[0]].type, seed: sector.stars[sector.playerStar[0]*sector.playerStar[1]].planets[sector.playerPlanet[0]].seed }, sectors: [galaxy.playerSector, sector.playerStar, sector.playerPlanet]})
	}

	console.log(location)

	return (
		<div className="grid grid-cols-2 gap-0" style={{position: "absolute", top: "0px", right: "0px", width: "100vw", height: "100vh"}}>
			{(location != null) && (<iframe style={{zIndex: "-1", position: "absolute", top: "0px", left: "0px", width: size/2+"px", height: size/2+"px"}} src={"./resources/pocketspace/planet-gen/PixelPlanets.html?type="+galaxy.type+"&seed="+galaxy.seed} width="100%" height="100%"></iframe>)}
			{(location != null) && (<i style={{zIndex: "0", position: "absolute", top: size/2*(location.sectors[0][0]/100)+"px", left: size/2*(location.sectors[0][1]/100)+"px"}} className="lab la-first-order text-green-500"></i>)}
			{(location != null) && (<iframe style={{zIndex: "-1", position: "absolute", top: "0px", left: size/2+"px", width: size/2+"px", height: size/2+"px"}} src={"./resources/pocketspace/planet-gen/PixelPlanets.html?type="+sector.type+"&seed="+sector.seed} width="100%" height="100%"></iframe>)}
			{(location != null) && (<i style={{zIndex: "0", position: "absolute", top: size/2*(location.sectors[1][0]/100)+"px", left: (size/2+size/2*(location.sectors[1][1]/100))+"px"}} className="lab la-first-order text-green-500"></i>)}
			{(location != null) && (<iframe style={{zIndex: "-1", position: "absolute", top: "0px", left: size+"px", width: size/2+"px", height: size/2+"px"}} src={"./resources/pocketspace/planet-gen/PixelPlanets.html?type="+sector.stars[location.sectors[1][0]*location.sectors[1][1]].type+"&seed="+sector.stars[location.sectors[1][0]*location.sectors[1][1]].seed} width="100%" height="100%"></iframe>)}
			{(location != null) && (
				<div className="flex flex-column justify-center text-center" style={{zIndex: "0", position: "absolute", top: "0px", left: size+"px", width: size/2+"px", height: size/2+"px"}}>
					{[...Array(sector.stars[location.sectors[1][0]*location.sectors[1][1]].planets.length)].map((el, ind) => (
						<div style={{zIndex: "0", position: "absolute", top: 10*(ind+1)+"px", width: (size/2-20*(ind+1))+"px", height: (size/2-20*(ind+1))+"px", border: "1px solid white", borderRadius: "50%"}}></div>
					))}
					{[...Array(sector.stars[location.sectors[1][0]*location.sectors[1][1]].planets.length)].map((el, ind) => {
						let lat = randomInteger(0, 360);
						return (ind != sector.playerPlanet[0]) && (<i style={{zIndex: "0", position: "absolute", bottom: (size/4+((size/2-20*(ind+1))/2)*Math.sin(lat*0.0175)-8)+"px", left: (size/4+((size/2-20*(ind+1))/2)*Math.cos(lat*0.0175)-8)+"px", fill: "white"}} className="lab la-first-order-alt"></i>)
					})}
					<i style={{zIndex: "0", position: "absolute", bottom: (size/4+((size/2-20*(sector.playerPlanet[0]+1))/2)*Math.sin(sector.playerPlanet[1]*0.0175)-8)+"px", left: (size/4+((size/2-20*(sector.playerPlanet[0]+1))/2)*Math.cos(sector.playerPlanet[1]*0.0175)-8)+"px"}} className="lab la-first-order-alt text-green-500"></i>
				</div>
			)}
			{(location != null) && (<iframe style={{zIndex: "-1", position: "absolute", top: "0px", left: size+size/2+"px", width: size/2+"px", height: size/2+"px"}} src={"./resources/pocketspace/planet-gen/PixelPlanets.html?type="+location.target.type+"&seed="+location.target.seed} width="100%" height="100%"></iframe>)}
			<div className="flex flex-column justify-end"></div>
			{/*{(population != null) && (
				<div className="grid grid-cols-4 grid-rows-12 gap-2">
					{(location != null) && (
						(location.way.length == 0) && (
							population.stars.slice(page*100, (page+1)*100).map((el, index) => (
	                            <button className="btn btn-active" onClick={function() {moveInto(el, index)}}>{el.type+"-"+el.seed}</button>
	                        ))
						)
					)}
					{(location != null) && (
						(location.way.length == 1) && (
							population.stars[location.way[0]].planets.map((el, index) => (
	                            <button className="btn btn-active" onClick={function() {moveInto(el, index)}}>{el.type+"-"+el.seed}</button>
	                        ))
						)
					)}
				</div>
			)}*/}
		</div>
	)
}
export default PoketSpace;