import { t } from 'ttag';
import React, {useState, useEffect, useRef} from "react";
import GoogleMapReact from 'google-map-react';

const OilMap = () => {
	const [stats, setStats] = useState(false)
	const [selected, setSelected] = useState("0")
	const [load, setLoad] = useState(false)
	const [towers, setTowers] = useState([])

	const defaultProps = {
		center: {
		  lat: 55.385229,
		  lng: 51.153256
		},
		zoom: 8
	};
	const methods = {
		1: "https://"+window.location.hostname+"/api/corr/",
		2: "https://"+window.location.hostname+"/api/claster/factors/",
		3: "https://"+window.location.hostname+"/api/claster/y/",
		4: "https://"+window.location.hostname+"/api/linear/all/y1/",
		5: "https://"+window.location.hostname+"/api/linear/all/y2/",
		6: "https://"+window.location.hostname+"/api/linear/all/y3/",
		7: "https://"+window.location.hostname+"/api/linear/cl2/y1/",
		8: "https://"+window.location.hostname+"/api/linear/cl2/y2/",
		9: "https://"+window.location.hostname+"/api/linear/cl2/y3/",
		10: "https://"+window.location.hostname+"/api/linear/factors/y1/",
		11: "https://"+window.location.hostname+"/api/linear/factors/y2/",
		12: "https://"+window.location.hostname+"/api/linear/factors/y3/",
		13: "https://"+window.location.hostname+"/api/genetic/y1/",
		14: "https://"+window.location.hostname+"/api/genetic/y2/",
		15: "https://"+window.location.hostname+"/api/genetic/y3/"
	}

	useEffect(() => {
		fetch("https://"+window.location.hostname+"/api/map/")
		.then(response => response.json())
        .then(commits => {
            setTowers(commits.data)
        })
	}, [])

	useEffect(() => {
		if (selected != "0") {
			setLoad(false)
			fetch(methods[selected])
			.then(response => response.json())
            .then(commits => {
                setLoad(commits)
	            console.log(commits.data)
            });
		}
	}, [selected])

	return (
		<div className="w-full grid grid-cols-2 gap-0">
			<div className="ml-20" style={{ height: '100vh'}}>
				<GoogleMapReact
				  bootstrapURLKeys={{ key: "" }}
				  defaultCenter={defaultProps.center}
				  defaultZoom={defaultProps.zoom}
				>
				  {towers.map((tower, index) => (
				  	<button lat={tower.lat} lng={tower.lng} type="button" className="btn btn-primary" onClick={function () {setStats(tower)}}>{t`№`+Object.entries(tower)[0][1]}</button>
				  ))}
				</GoogleMapReact>
			</div>
			{(stats === false) ? (
			  <div style={{ height: '100vh', width: '100%' }}>
				  <div className="flex flex-col items-center justify-center">
			        <h1 className="my-5">{t`Select the oil tower`}</h1>
				    <select className="select select-bordered select-primary w-full max-w-xs mb-5" value={selected} onChange={e => setSelected(e.target.value)}>
					  <option value="0" disabled="disabled" selected="selected">{t`Choose stats`}</option>
					  <option value="1">{t`Correlation analysis`}</option>
					  <option value="2">{t`Сluster analysis (factors)`}</option>
					  <option value="3">{t`Сluster analysis (Y's)`}</option>
					  <option value="4">{t`Linear Regression for Y1 (all clusters)`}</option>
					  <option value="5">{t`Linear Regression for Y2 (all clusters)`}</option>
					  <option value="6">{t`Linear Regression for Y3 (all clusters)`}</option>
					  <option value="7">{t`Linear Regression for Y1 (CL2)`}</option>
					  <option value="8">{t`Linear Regression for Y2 (CL2)`}</option>
					  <option value="9">{t`Linear Regression for Y3 (CL2)`}</option>
					  <option value="10">{t`Accuracy table for Y1 (SFS, SBS, CA)`}</option>
					  <option value="11">{t`Accuracy table for Y2 (SFS, SBS, CA)`}</option>
					  <option value="12">{t`Accuracy table for Y3 (SFS, SBS, CA)`}</option>
		              <option value="13">{t`Genetic Algorithm for Y1`}</option>
			          <option value="14">{t`Genetic Algorithm for Y2`}</option>
			          <option value="15">{t`Genetic Algorithm for Y3`}</option>
					</select>
					{((load == false) && (selected != "0")) && (
					  <button className="btn btn-sm btn-ghost loading">{t`Loading`}</button>
					)}
					{((load != false) && (selected == "1")) && (
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					)}
					{((load != false) && (selected == "2")) && (
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					)}
					{((load != false) && (selected == "3")) && (
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					)}
					{((load != false) && (selected == "4")) && (
					<div>
					<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
					)}
					{((load != false) && (selected == "5")) && (
					<div>
					<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
					)}
					{((load != false) && (selected == "6")) && (
					<div>
					<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format: `+load.acc_factors}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
					)}
					{((load != false) && (selected == "7")) && (
					<div>
					<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
					)}
					{((load != false) && (selected == "8")) && (
					<div>
					<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
					)}
					{((load != false) && (selected == "9")) && (
					<div>
					<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Linear regression accuracy in R^2 format: `+load.acc_factors}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
					)}
					{((load != false) && (selected == "10") && (load.data[0]["Column-indexes"] != null)) && (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th></th>
									<th>Column indexes</th>
									<th>Training accuracy</th>
									<th>Test accuracy</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>SFS</th>
									<td>{load.data[0]["Column-indexes"].join(' ')}</td>
									<td>{load.data[0]["Training-accuracy"]}</td>
									<td>{load.data[0]["Test-accuracy"]}</td>
								</tr>
								<tr>
									<th>SBS</th>
									<td>{load.data[1]["Column-indexes"].join(' ')}</td>
									<td>{load.data[1]["Training-accuracy"]}</td>
									<td>{load.data[1]["Test-accuracy"]}</td>
								</tr>
								<tr>
									<th>Correlation analysis</th>
									<td>{load.data[2]["Column-indexes"].join(' ')}</td>
									<td>{load.data[2]["Training-accuracy"]}</td>
									<td>{load.data[2]["Test-accuracy"]}</td>
								</tr>
							</tbody>
						</table>
					</div>
					)}
					{((load != false) && (selected == "11") && (load.data[0]["Column-indexes"] != null)) && (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th></th>
									<th>Column indexes</th>
									<th>Training accuracy</th>
									<th>Test accuracy</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>SFS</th>
									<td>{load.data[0]["Column-indexes"].join(' ')}</td>
									<td>{load.data[0]["Training-accuracy"]}</td>
									<td>{load.data[0]["Test-accuracy"]}</td>
								</tr>
								<tr>
									<th>SBS</th>
									<td>{load.data[1]["Column-indexes"].join(' ')}</td>
									<td>{load.data[1]["Training-accuracy"]}</td>
									<td>{load.data[1]["Test-accuracy"]}</td>
								</tr>
								<tr>
									<th>Correlation analysis</th>
									<td>{load.data[2]["Column-indexes"].join(' ')}</td>
									<td>{load.data[2]["Training-accuracy"]}</td>
									<td>{load.data[2]["Test-accuracy"]}</td>
								</tr>
							</tbody>
						</table>
					</div>
					)}
					{((load != false) && (selected == "12") && (load.data[0]["Column-indexes"] != null)) && (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th></th>
									<th>Column indexes</th>
									<th>Training accuracy</th>
									<th>Test accuracy</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>SFS</th>
									<td>{load.data[0]["Column-indexes"].join(' ')}</td>
									<td>{load.data[0]["Training-accuracy"]}</td>
									<td>{load.data[0]["Test-accuracy"]}</td>
								</tr>
								<tr>
									<th>SBS</th>
									<td>{load.data[1]["Column-indexes"].join(' ')}</td>
									<td>{load.data[1]["Training-accuracy"]}</td>
									<td>{load.data[1]["Test-accuracy"]}</td>
								</tr>
								<tr>
									<th>Correlation analysis</th>
									<td>{load.data[2]["Column-indexes"].join(' ')}</td>
									<td>{load.data[2]["Training-accuracy"]}</td>
									<td>{load.data[2]["Test-accuracy"]}</td>
								</tr>
							</tbody>
						</table>
					</div>
					)}
				    {((load != false) && (selected == "13")) && (
			        <div>
					<h1 className="my-2">{t`Genetic algorithm regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Column indexes: `+load.factors.join(' ')}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
				    )}
				    {((load != false) && (selected == "14")) && (
			        <div>
					<h1 className="my-2">{t`Genetic algorithm regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Column indexes: `+load.factors.join(' ')}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
				    )}
				    {((load != false) && (selected == "15")) && (
			        <div>
					<h1 className="my-2">{t`Genetic algorithm regression equation: `+load.y_string}</h1>
					<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for training set: `+load.acc_train}</h1>
					<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for the test set: `+load.acc_test}</h1>
					<h1 className="my-2">{t`Column indexes: `+load.factors.join(' ')}</h1>
					<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
					<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
					<img src={"data:image/png;base64, "+load.data} alt=""/>
					</div>
				    )}
				  </div>
			  </div>
			) : (
			  <div style={{ height: '100vh', width: '100%' }}>
			      <div className="flex flex-col items-center justify-center">
			          <h1 className="my-5">{t`Oil tower №`+Object.entries(stats)[0][1]}</h1>
				      <div style={{width: '100%'}} className="overflow-x-scroll mb-5">
						<table className="table w-full">
							<thead>
								<tr>
									<th></th>
									<th>Y1</th>
									<th>Y2</th>
									<th>Y3</th>
									<th>X1</th>
									<th>X2</th>
									<th>X3</th>
									<th>X4</th>
									<th>X5</th>
									<th>X6</th>
									<th>X7</th>
									<th>X8</th>
									<th>X9</th>
									<th>X10</th>
									<th>X11</th>
									<th>X12</th>
									<th>X13</th>
									<th>X14</th>
									<th>X15</th>
									<th>X16</th>
									<th>X17</th>
									<th>X18</th>
									<th>X19</th>
									<th>X20</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>{"№"+Object.entries(stats)[0][1]}</th>
									<td>{stats.Y1}</td>
									<td>{stats.Y2}</td>
									<td>{stats.Y3}</td>
									<td>{stats.X1}</td>
									<td>{stats.X2}</td>
									<td>{stats.X3}</td>
									<td>{stats.X4}</td>
									<td>{stats.X5}</td>
									<td>{stats.X6}</td>
									<td>{stats.X7}</td>
									<td>{stats.X8}</td>
									<td>{stats.X9}</td>
									<td>{stats.X10}</td>
									<td>{stats.X11}</td>
									<td>{stats.X12}</td>
									<td>{stats.X13}</td>
									<td>{stats.X14}</td>
									<td>{stats.X15}</td>
									<td>{stats.X16}</td>
									<td>{stats.X17}</td>
									<td>{stats.X18}</td>
									<td>{stats.X19}</td>
									<td>{stats.X20}</td>
								</tr>
							</tbody>
						</table>
					  </div>
			          <button type="button" className="btn btn-primary mb-5" onClick={function () {setStats(false)}}>{t`Hide tower`}</button>
				      <select className="select select-bordered select-primary w-full max-w-xs mb-5" value={selected} onChange={e => setSelected(e.target.value)}>
					      <option value="0" disabled="disabled" selected="selected">{t`Choose stats`}</option>
					      <option value="1">{t`Correlation analysis`}</option>
					      <option value="2">{t`Сluster analysis (factors)`}</option>
					      <option value="3">{t`Сluster analysis (Y's)`}</option>
					      <option value="4">{t`Linear Regression for Y1 (all clusters)`}</option>
					      <option value="5">{t`Linear Regression for Y2 (all clusters)`}</option>
					      <option value="6">{t`Linear Regression for Y3 (all clusters)`}</option>
					      <option value="7">{t`Linear Regression for Y1 (CL2)`}</option>
					      <option value="8">{t`Linear Regression for Y2 (CL2)`}</option>
					      <option value="9">{t`Linear Regression for Y3 (CL2)`}</option>
					      <option value="10">{t`Accuracy table for Y1 (SFS, SBS, CA)`}</option>
					      <option value="11">{t`Accuracy table for Y2 (SFS, SBS, CA)`}</option>
					      <option value="12">{t`Accuracy table for Y3 (SFS, SBS, CA)`}</option>
					      <option value="13">{t`Genetic Algorithm for Y1`}</option>
				          <option value="14">{t`Genetic Algorithm for Y2`}</option>
				          <option value="15">{t`Genetic Algorithm for Y3`}</option>
				      </select>
				      {((load == false) && (selected != "0")) && (
					      <button className="btn btn-sm btn-ghost loading">{t`Loading`}</button>
				      )}
				      {((load != false) && (selected == "1")) && (
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				      )}
				      {((load != false) && (selected == "2")) && (
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				      )}
				      {((load != false) && (selected == "3")) && (
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				      )}
				      {((load != false) && (selected == "4")) && (
				      	<div>
				        <h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
				        <h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
				        <h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					    <h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
				        <img src={"data:image/png;base64, "+load.data} alt=""/>
				        </div>
				      )}
				      {((load != false) && (selected == "5")) && (
				      	<div>
				      	<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
				      	<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
				        <h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					    <h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				        </div>
				      )}
				      {((load != false) && (selected == "6")) && (
				      	<div>
				      	<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format: `+load.acc_factors}</h1>
				      	<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
				        <h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					    <h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				        </div>
				      )}
				      {((load != false) && (selected == "7")) && (
				      	<div>
				      	<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
				      	<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
				        <h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					    <h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				        </div>
				      )}
				      {((load != false) && (selected == "8")) && (
				      	<div>
				      	<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
				      	<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
				        <h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					    <h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
				      	<img src={"data:image/png;base64, "+load.data} alt=""/>
				        </div>
				      )}
				      {((load != false) && (selected == "9")) && (
				      	<div>
				      	<h1 className="my-2">{t`Linear regression equation: `+load.y_string}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for training set: `+load.acc_train}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format for the test set: `+load.acc_test}</h1>
				        <h1 className="my-2">{t`Linear regression accuracy in R^2 format: `+load.acc_factors}</h1>
				      	<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
				        <h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
					    <h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
				        <img src={"data:image/png;base64, "+load.data} alt=""/>
				        </div>
				      )}
				      {((load != false) && (selected == "10") && (load.data[0]["Column-indexes"] != null)) && (
				      	<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
									<tr>
										<th></th>
										<th>Column indexes</th>
										<th>Training accuracy</th>
										<th>Test accuracy</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th>SFS</th>
										<td>{load.data[0]["Column-indexes"].join(' ')}</td>
										<td>{load.data[0]["Training-accuracy"]}</td>
										<td>{load.data[0]["Test-accuracy"]}</td>
									</tr>
									<tr>
										<th>SBS</th>
										<td>{load.data[1]["Column-indexes"].join(' ')}</td>
										<td>{load.data[1]["Training-accuracy"]}</td>
										<td>{load.data[1]["Test-accuracy"]}</td>
									</tr>
									<tr>
										<th>Correlation analysis</th>
										<td>{load.data[2]["Column-indexes"].join(' ')}</td>
										<td>{load.data[2]["Training-accuracy"]}</td>
										<td>{load.data[2]["Test-accuracy"]}</td>
									</tr>
								</tbody>
							</table>
						</div>
				      )}
				      {((load != false) && (selected == "11") && (load.data[0]["Column-indexes"] != null)) && (
				      	<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
									<tr>
										<th></th>
										<th>Column indexes</th>
										<th>Training accuracy</th>
										<th>Test accuracy</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th>SFS</th>
										<td>{load.data[0]["Column-indexes"].join(' ')}</td>
										<td>{load.data[0]["Training-accuracy"]}</td>
										<td>{load.data[0]["Test-accuracy"]}</td>
									</tr>
									<tr>
										<th>SBS</th>
										<td>{load.data[1]["Column-indexes"].join(' ')}</td>
										<td>{load.data[1]["Training-accuracy"]}</td>
										<td>{load.data[1]["Test-accuracy"]}</td>
									</tr>
									<tr>
										<th>Correlation analysis</th>
										<td>{load.data[2]["Column-indexes"].join(' ')}</td>
										<td>{load.data[2]["Training-accuracy"]}</td>
										<td>{load.data[2]["Test-accuracy"]}</td>
									</tr>
								</tbody>
							</table>
						</div>
				      )}
				      {((load != false) && (selected == "12") && (load.data[0]["Column-indexes"] != null)) && (
						<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
									<tr>
										<th></th>
										<th>Column indexes</th>
										<th>Training accuracy</th>
										<th>Test accuracy</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th>SFS</th>
										<td>{load.data[0]["Column-indexes"].join(' ')}</td>
										<td>{load.data[0]["Training-accuracy"]}</td>
										<td>{load.data[0]["Test-accuracy"]}</td>
									</tr>
									<tr>
										<th>SBS</th>
										<td>{load.data[1]["Column-indexes"].join(' ')}</td>
										<td>{load.data[1]["Training-accuracy"]}</td>
										<td>{load.data[1]["Test-accuracy"]}</td>
									</tr>
									<tr>
										<th>Correlation analysis</th>
										<td>{load.data[2]["Column-indexes"].join(' ')}</td>
										<td>{load.data[2]["Training-accuracy"]}</td>
										<td>{load.data[2]["Test-accuracy"]}</td>
									</tr>
								</tbody>
							</table>
						</div>
				      )}
				      {((load != false) && (selected == "13")) && (
				        <div>
						<h1 className="my-2">{t`Genetic algorithm regression equation: `+load.y_string}</h1>
						<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for training set: `+load.acc_train}</h1>
						<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for the test set: `+load.acc_test}</h1>
						<h1 className="my-2">{t`Column indexes: `+load.factors.join(' ')}</h1>
						<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
						<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
						<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
						<img src={"data:image/png;base64, "+load.data} alt=""/>
						</div>
					    )}
					    {((load != false) && (selected == "14")) && (
				        <div>
						<h1 className="my-2">{t`Genetic algorithm regression equation: `+load.y_string}</h1>
						<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for training set: `+load.acc_train}</h1>
						<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for the test set: `+load.acc_test}</h1>
						<h1 className="my-2">{t`Column indexes: `+load.factors.join(' ')}</h1>
						<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
						<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
						<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
						<img src={"data:image/png;base64, "+load.data} alt=""/>
						</div>
					    )}
					    {((load != false) && (selected == "15")) && (
				        <div>
						<h1 className="my-2">{t`Genetic algorithm regression equation: `+load.y_string}</h1>
						<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for training set: `+load.acc_train}</h1>
						<h1 className="my-2">{t`Genetic algorithm accuracy in R^2 format for the test set: `+load.acc_test}</h1>
						<h1 className="my-2">{t`Column indexes: `+load.factors.join(' ')}</h1>
						<h1 className="my-2">{t`Standard error to mean: `+load.std}</h1>
						<h1 className="my-2">{t`Determination coefficient: `+load.det_coff}</h1>
						<h1 className="my-2">{t`Fisher's criterion: `+load.fisher}</h1>
						<img src={"data:image/png;base64, "+load.data} alt=""/>
						</div>
					    )}
		          </div>
			  </div>
			)}
		</div>
	)
}
export default OilMap;

