import React, { createElement, Fragment, useEffect, useRef } from "react";
import "./App.css";
import { Octokit} from "octokit";
import CanvasJSReact from '@canvasjs/react-charts';
import { autocomplete } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import { Root, createRoot } from 'react-dom/client';
import qs from 'qs';
import { RepoItem, GitHubRepository} from "./RepoItem.tsx"
import { ReactComponent as DeleteIcon } from './trash-2.svg';

const octokit = new Octokit({
  auth: process.env.REACT_APP_AUTH_TOKEN
})

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

async function itemToRepoData(item: any) {

	const weeks = await octokit.request('GET /repos/{owner}/{repo}/stats/participation', {
		owner: item.full_name.split("/")[0],
		repo: item.full_name.split("/")[1]
	  })

	const response = weeks.data.all.map((value: any, index: any) => {
		var repoDataPoint = {"x": index, "y": value};
		return repoDataPoint;
	 })

	 return response

}


async function itemListToGraphOptions(items: any[]){

	if (items.length === 0) {return [{}]}

	const dataItems = await Promise.all(items.map(async (value: any, index: any) => {
		const dataPoints = await itemToRepoData(value);
		var dataObject = {"type":"spline",
						  "name": value.full_name,
						  "showInLegend": true,
						  "dataPoints": dataPoints,
						  "color": value.color};
		return dataObject;
	}))
	
	const response = {
		animationEnabled: false,	
		axisX : {
			minimum: 0,
			maximum: 64,
			title: "Weeks after one year ago"
		},
		axisY : {
			title: "Commits"
		},
		toolTip: {
			shared: false
		},
		data: dataItems
	}
	return response
}

async function getPrediction(repo: string) {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo })
    };
    const response = await fetch('http://localhost:8000/predict/', requestOptions);
    const theData = await response.json();
    return theData.data;
}

 
function debouncePromise<TParams extends unknown[], TResponse>(
	fn: (...params: TParams) => Promise<TResponse>,
	time: number
  ) {
	let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  
	return function (...args: TParams) {
	  if (timerId) {
		clearTimeout(timerId);
	  }
  
	  return new Promise<TResponse>((resolve) => {
		timerId = setTimeout(() => resolve(fn(...args)), time);
	  });
	};
  }
  
  
const debouncedFetch = debouncePromise(fetch, 300);
  
const baseUrl = `https://api.github.com/search/repositories`;
 
export default function ActivityExplorer (){

	const defaultGraphOptions = {
		animationEnabled: false,	
		axisX : {
			minimum: 0,
			maximum: 64,
			title: "Weeks after one year ago"
		},
		axisY : {
			title: "Commits"
		},
		toolTip: {
			shared: false
		},
		data: [{}]
	}

	var [repoItemList, setRepoItemList] = React.useState<any[]>([])
	var [graphOptions, setGraphOptions] = React.useState(defaultGraphOptions)
	
	const containerRef = useRef<HTMLDivElement | null>(null);
	const panelRootRef = useRef<Root | null>(null);
	const rootRef = useRef<HTMLElement | null>(null);

	async function onDelete(t: any) {
		var newRepoItemList = repoItemList.filter(function(repo: any) { return repo!== t }); 
		setRepoItemList(newRepoItemList);
		var newOptions = await itemListToGraphOptions(newRepoItemList); 
		setGraphOptions(newOptions);
	}

	async function onPredict(t: any) {
		const prediction = await getPrediction(t.full_name);
		var dataObject = {"type":"spline", 
							"name": t.full_name+"_predict",
							"showInLegend": true,
							"dataPoints": prediction,
							"color": t.color};
		var newOptions = {...graphOptions};
		newOptions["data"] = graphOptions["data"].concat([dataObject]);
		setGraphOptions(newOptions);
	}

	useEffect(() => {
		if (!containerRef.current) {
		  return undefined;
		}

		async function onSelect(item: any){
			const random_color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6).toUpperCase()
			item["color"] = random_color
			setRepoItemList(repoItemList.concat([item]))
			var newOptions = await itemListToGraphOptions(repoItemList.concat([item]));
			setGraphOptions(newOptions)			
		}
	
		const search = autocomplete<GitHubRepository>({
		  container: containerRef.current,
		  placeholder: 'Search',
		  async getSources({ query, state, setQuery, refresh}) {
			const queryParameters = qs.stringify({ ...{per_page: 5}, q: query });
			const endpoint = [baseUrl, queryParameters].join('?');
			return debouncedFetch(endpoint)
			  .then((response) => response.json())
			  .then((repositories) => {
				return [
				  {
					sourceId: 'githubPlugin',
					getItems() {
					  return repositories.items || [];
					},
					getItemUrl({ item }) {
					  return item.html_url;
					},
					
					templates: {
					  
					  item({ item }) {
						const stars = new Intl.NumberFormat('en-US').format(
						  item.stargazers_count
						);
	  
						return (
						  <div className="aa-ItemWrapper">
							<div className="aa-ItemContent" onClick={() => {onSelect(item)}}>
							  <div className="aa-ItemIcon aa-ItemIcon--alignTop">
								<img
								  src={item.owner.avatar_url}
								  alt={item.full_name}
								  width="40"
								  height="40"
								/>
							  </div>
							  <div className="aa-ItemContentBody">
								<div className="aa-ItemContentTitle">
								  <div style={{ display: 'flex' }}>
									<div style={{ fontWeight: 700 }}>
									  {item.full_name}
									</div>
									<div
									  style={{
										alignItems: 'center',
										display: 'flex',
										marginLeft: 'var(--aa-spacing-half)',
										position: 'relative',
										top: '1px',
									  }}
									>
									  <svg
										aria-label={`${stars} stars`}
										style={{
										  display: 'block',
										  width: 'calc(var(--aa-spacing-half) * 2)',
										  height: 'calc(var(--aa-spacing-half) * 2)',
										  color: '#ffa724',
										}}
										viewBox="0 0 20 20"
										fill="currentColor"
									  >
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									  </svg>{' '}
									  <span
										aria-hidden="true"
										style={{
										  color: 'var(--aa-content-text-color)',
										  fontSize: '0.8em',
										  lineHeight: 'normal',
										}}
									  >
										{stars}
									  </span>
									</div>
								  </div>
								</div>
								<div className="aa-ItemContentDescription">
								  {item.description}
								</div>
							  </div>
							</div>
							<div className="aa-ItemActions">
							  <button
								className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
								type="button"
								title="Select"
								style={{ pointerEvents: 'none' }}
							  >
								<svg
								  viewBox="0 0 24 24"
								  width="20"
								  height="20"
								  fill="currentColor"
								>
								  <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
								</svg>
							  </button>
							</div>
						  </div>
						);
					  },
					},
				  },
				];
			  });
		  },
		  renderer: { createElement, Fragment, render: () => {} },
		  render({ children }: any, root: Element | DocumentFragment | null) {
			if (!panelRootRef.current || rootRef.current !== root) {
			  rootRef.current = root;
	
			  panelRootRef.current?.unmount();
			  panelRootRef.current = createRoot(root);
			}
	
			panelRootRef.current.render(children);
		  },

		});

	
		return () => {
		  search.destroy();
		};
	  },[repoItemList, graphOptions]);

	
	return (
		<div className="parentDiv">
			<div className="graphDiv">
			<CanvasJSChart options = {graphOptions} 
					/* onRef={ref => this.chart = ref} */
				/>
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
			<div className="repoDiv">
				<div ref={containerRef} />
				<ul style={{backgroundColor: "black", color: "white"}}>
				{
					repoItemList?.map( (t, idx: number) => (
					<div style={{ width: "100%", display: "flex", justifyContent: "space-around"}} className="repoItem">
						<div style={{ height: "inherit", width: "5%", backgroundColor:t.color, boxSizing: "border-box"}}/>
						<div style={{ height: "inherit", width: "75%", boxSizing: "border-box"}}><RepoItem item={t} /> </div>
						<div style={{ height: "inherit", width: "20%", boxSizing: "border-box"}}>
						<button style={{marginLeft: 10}} value={""+idx} 
								onClick={() => onDelete(t)}>
							<DeleteIcon/>
						</button>
						<button style={{marginLeft: 10}} 
								onClick={() => onPredict(t)}> Predict
						</button>
						</div>
					</div>
					))
				}
				</ul>
			</div>
		</div>
		);
	}