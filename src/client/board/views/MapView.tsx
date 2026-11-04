import { useState } from 'react';
import { labelsOf } from '../../../shared/columns';
import type { ItemDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { EmptyState } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import '../../styles/views.css';

const W = 360;
const H = 180;

interface Loc { address?: string; lat?: number; lng?: number }

export function MapView(props: BoardViewProps) {
  const { bundle, view, items, canEdit, actions, openItem, updateViewSettings } = props;
  const locCols = bundle.columns.filter((c) => c.type === 'location');
  const col = locCols.find((c) => c.id === view.settings.mapColumnId) ?? locCols[0];
  const [hover, setHover] = useState<string | null>(null);

  if (!col) {
    return (
      <EmptyState icon="map" title="Map needs a location column" action={canEdit ? <button className="btn primary" onClick={() => actions.createColumn({ title: 'Location', type: 'location' })}>Add a location column</button> : undefined}>
        Items with a location (address and optional coordinates) are shown on the map.
      </EmptyState>
    );
  }

  const statusCol = bundle.columns.find((c) => c.type === 'status');
  const colorOf = (i: ItemDTO) => (statusCol ? labelsOf(statusCol).find((l) => l.id === i.values[statusCol.id])?.color : undefined) ?? '#5b5bd6';
  const locOf = (i: ItemDTO) => (i.values[col.id] as Loc | undefined) ?? null;
  const withCoords = items.filter((i) => typeof locOf(i)?.lat === 'number' && typeof locOf(i)?.lng === 'number');
  const addressOnly = items.filter((i) => locOf(i) && !withCoords.includes(i));
  const missing = items.filter((i) => !locOf(i));
  const proj = (lat: number, lng: number) => ({ x: ((lng + 180) / 360) * W, y: ((90 - lat) / 180) * H });
  const hovered = withCoords.find((i) => i.id === hover);

  return (
    <div className="map-view">
      <div>
        {locCols.length > 1 ? (
          <div className="row" style={{ marginBottom: 8 }}>
            <label className="label" htmlFor="map-col">Location column</label>
            <select id="map-col" className="select sm" style={{ width: 'auto' }} value={col.id} onChange={(e) => updateViewSettings({ mapColumnId: e.target.value })}>
              {locCols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        ) : null}
        <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of ${withCoords.length} items with coordinates`}>
          {Array.from({ length: 11 }, (_, i) => -150 + i * 30).map((lng) => <line key={'m' + lng} className="grat" x1={proj(0, lng).x} x2={proj(0, lng).x} y1={0} y2={H} />)}
          {[-60, -30, 30, 60].map((lat) => <line key={'p' + lat} className="grat" x1={0} x2={W} y1={proj(lat, 0).y} y2={proj(lat, 0).y} />)}
          <line className="equator" x1={0} x2={W} y1={H / 2} y2={H / 2} />
          {[-60, -30, 0, 30, 60].map((lat) => <text key={'t' + lat} x={2} y={proj(lat, 0).y - 1}>{lat}°</text>)}
          {withCoords.map((i) => {
            const l = locOf(i)!;
            const p = proj(l.lat!, l.lng!);
            return (
              <circle
                key={i.id}
                className="pt"
                cx={p.x}
                cy={p.y}
                r={hover === i.id ? 6 : 4}
                fill={colorOf(i)}
                tabIndex={0}
                role="button"
                aria-label={`${i.name}${l.address ? `, ${l.address}` : ''}`}
                onMouseEnter={() => setHover(i.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i.id)}
                onBlur={() => setHover(null)}
                onClick={() => openItem(i.id)}
                onKeyDown={(e) => e.key === 'Enter' && openItem(i.id)}
              >
                <title>{i.name}</title>
              </circle>
            );
          })}
          {hovered ? (() => {
            const l = locOf(hovered)!;
            const p = proj(l.lat!, l.lng!);
            const tx = Math.min(W - 110, Math.max(2, p.x + 6));
            return (
              <g pointerEvents="none">
                <rect x={tx} y={Math.max(2, p.y - 18)} width={108} height={14} rx={3} fill="var(--surface)" stroke="var(--border)" />
                <text x={tx + 4} y={Math.max(2, p.y - 18) + 10} style={{ fill: 'var(--text)' }}>{hovered.name.slice(0, 26)}</text>
              </g>
            );
          })() : null}
        </svg>
        <p className="muted small" style={{ marginTop: 6 }}>Schematic world projection (no external map tiles are loaded). Use “Open in OpenStreetMap” for street-level detail.</p>
      </div>
      <div className="card">
        <div className="card-header"><h3 className="grow">Locations</h3><span className="muted small">{withCoords.length + addressOnly.length}/{items.length}</span></div>
        <div className="list" style={{ maxHeight: 480, overflow: 'auto' }}>
          {withCoords.map((i) => {
            const l = locOf(i)!;
            return (
              <div key={i.id} className="list-row" onMouseEnter={() => setHover(i.id)} onMouseLeave={() => setHover(null)}>
                <span className="icon-dot" style={{ background: colorOf(i) }} />
                <div className="grow" style={{ minWidth: 0 }}>
                  <button className="btn ghost sm ellipsis" style={{ padding: 0, maxWidth: '100%' }} onClick={() => openItem(i.id)}>{i.name}</button>
                  <div className="muted small ellipsis">{l.address || `${l.lat}, ${l.lng}`}</div>
                </div>
                <a className="btn ghost icon sm" href={`https://www.openstreetmap.org/?mlat=${l.lat}&mlon=${l.lng}#map=12/${l.lat}/${l.lng}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${i.name} in OpenStreetMap`} title="Open in OpenStreetMap"><Icon name="globe" /></a>
              </div>
            );
          })}
          {addressOnly.map((i) => (
            <div key={i.id} className="list-row">
              <Icon name="pin" />
              <div className="grow" style={{ minWidth: 0 }}>
                <button className="btn ghost sm ellipsis" style={{ padding: 0, maxWidth: '100%' }} onClick={() => openItem(i.id)}>{i.name}</button>
                <div className="muted small ellipsis">{locOf(i)?.address} · no coordinates</div>
              </div>
            </div>
          ))}
          {missing.length ? <div className="menu-label" style={{ padding: '10px 14px 4px' }}>Missing location ({missing.length})</div> : null}
          {missing.slice(0, 50).map((i) => (
            <div key={i.id} className="list-row">
              <span className="grow ellipsis">{i.name}</span>
              <button className="btn sm" onClick={() => openItem(i.id)}>{canEdit ? 'Add location' : 'Open'}</button>
            </div>
          ))}
          {items.length === 0 ? <div className="muted small" style={{ padding: 14 }}>No items match this view.</div> : null}
        </div>
      </div>
    </div>
  );
}
