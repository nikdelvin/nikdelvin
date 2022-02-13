import { t } from 'ttag';
import React, {useState, useEffect, useRef} from "react";
import GoogleMapReact from 'google-map-react';

const OilMap = () => {
	const [stats, setStats] = useState(false)
	const [selected, setSelected] = useState("0")
	const [load, setLoad] = useState(false)

	const defaultProps = {
		center: {
		  lat: 10.99835602,
		  lng: 77.01502627
		},
		zoom: 11
	};
	const methods = {
		1: "https://dev.nikdelvin.com/api/corr/",
		2: "https://dev.nikdelvin.com/api/claster/factors/",
		3: "https://dev.nikdelvin.com/api/claster/y/",
		4: "https://dev.nikdelvin.com/api/linear/all/y1/",
		5: "https://dev.nikdelvin.com/api/linear/all/y2/",
		6: "https://dev.nikdelvin.com/api/linear/all/y3/",
		7: "https://dev.nikdelvin.com/api/linear/cl2/y1/",
		8: "https://dev.nikdelvin.com/api/linear/cl2/y2/",
		9: "https://dev.nikdelvin.com/api/linear/cl2/y3/",
		10: "https://dev.nikdelvin.com/api/linear/factors/y1/",
		11: "https://dev.nikdelvin.com/api/linear/factors/y2/",
		12: "https://dev.nikdelvin.com/api/linear/factors/y3/"
	}

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
				  <button lat={10.89835602} lng={77.01502627} type="button" className="btn btn-primary" onClick={function () {setStats(true)}}>{t`№1`}</button>
				</GoogleMapReact>
			</div>
			{(stats === false) ? (
			  <div style={{ height: '100vh', width: '100%' }}>
				  <div className="flex flex-col items-center justify-center">
			        <h1 className="my-5">{t`Select the oil tower`}</h1>
				  </div>
			  </div>
			) : (
			  <div style={{ height: '100vh', width: '100%' }}>
			      <div className="flex flex-col items-center justify-center">
			          <h1 className="my-5">{t`Oil tower №1`}</h1>
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
		          </div>
			  </div>
			)}
		</div>
	)
}
export default OilMap;

