/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SpanStatusCode, TraceFlags } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import * as assert from 'assert';
import * as grpc from '@grpc/grpc-js';
import { VERSION } from '@opentelemetry/core';
import {
  IEvent,
  IKeyValue,
  ILink,
  IResource,
  ISpan,
} from '@opentelemetry/otlp-transformer';

const traceIdArr = [
  31, 16, 8, 220, 142, 39, 14, 133, 196, 10, 13, 124, 57, 57, 178, 120,
];
const spanIdArr = [94, 16, 114, 97, 246, 79, 165, 62];
const parentIdArr = [120, 168, 145, 80, 152, 134, 67, 136];

export const mockedReadableSpan: ReadableSpan = {
  name: 'documentFetch',
  kind: 0,
  spanContext: () => {
    return {
      traceId: '1f1008dc8e270e85c40a0d7c3939b278',
      spanId: '5e107261f64fa53e',
      traceFlags: TraceFlags.SAMPLED,
    };
  },
  parentSpanId: '78a8915098864388',
  startTime: [1574120165, 429803070],
  endTime: [1574120165, 438688070],
  ended: true,
  status: { code: SpanStatusCode.OK },
  attributes: { component: 'document-load' },
  links: [
    {
      context: {
        traceId: '1f1008dc8e270e85c40a0d7c3939b278',
        spanId: '78a8915098864388',
        traceFlags: TraceFlags.SAMPLED,
      },
      attributes: { component: 'document-load' },
    },
  ],
  events: [
    {
      name: 'fetchStart',
      time: [1574120165, 429803070],
    },
    {
      name: 'domainLookupStart',
      time: [1574120165, 429803070],
    },
    {
      name: 'domainLookupEnd',
      time: [1574120165, 429803070],
    },
    {
      name: 'connectStart',
      time: [1574120165, 429803070],
    },
    {
      name: 'connectEnd',
      time: [1574120165, 429803070],
    },
    {
      name: 'requestStart',
      time: [1574120165, 435513070],
    },
    {
      name: 'responseStart',
      time: [1574120165, 436923070],
    },
    {
      name: 'responseEnd',
      time: [1574120165, 438688070],
    },
  ],
  duration: [0, 8885000],
  resource: Resource.default().merge(
    new Resource({
      service: 'ui',
      version: 1,
      cost: 112.12,
    })
  ),
  instrumentationLibrary: { name: 'default', version: '0.0.1' },
  droppedAttributesCount: 0,
  droppedEventsCount: 0,
  droppedLinksCount: 0,
};

export function ensureExportedEventsAreCorrect(events: IEvent[]) {
  assert.deepStrictEqual(
    events,
    [
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'fetchStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'domainLookupStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'domainLookupEnd',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'connectStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'connectEnd',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165435513088',
        name: 'requestStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165436923136',
        name: 'responseStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165438688000',
        name: 'responseEnd',
        droppedAttributesCount: 0,
      },
    ],
    'exported events are incorrect'
  );
}

export function ensureExportedAttributesAreCorrect(attributes: IKeyValue[]) {
  assert.deepStrictEqual(
    attributes,
    [
      {
        key: 'component',
        value: {
          stringValue: 'document-load',
          value: 'stringValue',
        },
      },
    ],
    'exported attributes are incorrect'
  );
}

export function ensureExportedLinksAreCorrect(attributes: ILink[]) {
  assert.deepStrictEqual(
    attributes,
    [
      {
        attributes: [
          {
            key: 'component',
            value: {
              stringValue: 'document-load',
              value: 'stringValue',
            },
          },
        ],
        traceId: Buffer.from(traceIdArr),
        spanId: Buffer.from(parentIdArr),
        traceState: '',
        droppedAttributesCount: 0,
      },
    ],
    'exported links are incorrect'
  );
}

export function ensureExportedSpanIsCorrect(span: ISpan) {
  if (span.attributes) {
    ensureExportedAttributesAreCorrect(span.attributes);
  }
  if (span.events) {
    ensureExportedEventsAreCorrect(span.events);
  }
  if (span.links) {
    ensureExportedLinksAreCorrect(span.links);
  }
  assert.deepStrictEqual(
    span.traceId,
    Buffer.from(traceIdArr),
    'traceId is wrong'
  );
  assert.deepStrictEqual(
    span.spanId,
    Buffer.from(spanIdArr),
    'spanId is wrong'
  );
  assert.strictEqual(span.traceState, '', 'traceState is wrong');
  assert.deepStrictEqual(
    span.parentSpanId,
    Buffer.from(parentIdArr),
    'parentIdArr is wrong'
  );
  assert.strictEqual(span.name, 'documentFetch', 'name is wrong');
  assert.strictEqual(span.kind, 'SPAN_KIND_INTERNAL', 'kind is wrong');
  assert.strictEqual(
    span.startTimeUnixNano,
    '1574120165429803008',
    'startTimeUnixNano is wrong'
  );
  assert.strictEqual(
    span.endTimeUnixNano,
    '1574120165438688000',
    'endTimeUnixNano is wrong'
  );
  assert.strictEqual(
    span.droppedAttributesCount,
    0,
    'droppedAttributesCount is wrong'
  );
  assert.strictEqual(span.droppedEventsCount, 0, 'droppedEventsCount is wrong');
  assert.strictEqual(span.droppedLinksCount, 0, 'droppedLinksCount is wrong');
  assert.deepStrictEqual(
    span.status,
    {
      code: 'STATUS_CODE_OK',
      message: '',
    },
    'status is wrong'
  );
}

export function ensureResourceIsCorrect(resource: IResource) {
  assert.deepStrictEqual(resource, {
    attributes: [
      {
        key: 'service.name',
        value: {
          stringValue: `unknown_service:${process.argv0}`,
          value: 'stringValue',
        },
      },
      {
        key: 'telemetry.sdk.language',
        value: {
          stringValue: 'nodejs',
          value: 'stringValue',
        },
      },
      {
        key: 'telemetry.sdk.name',
        value: {
          stringValue: 'opentelemetry',
          value: 'stringValue',
        },
      },
      {
        key: 'telemetry.sdk.version',
        value: {
          stringValue: VERSION,
          value: 'stringValue',
        },
      },
      {
        key: 'service',
        value: {
          stringValue: 'ui',
          value: 'stringValue',
        },
      },
      {
        key: 'version',
        value: {
          intValue: '1',
          value: 'intValue',
        },
      },
      {
        key: 'cost',
        value: {
          doubleValue: 112.12,
          value: 'doubleValue',
        },
      },
    ],
    droppedAttributesCount: 0,
  });
}

export function ensureMetadataIsCorrect(
  actual?: grpc.Metadata,
  expected?: grpc.Metadata
) {
  //ignore user agent
  expected?.remove('user-agent');
  actual?.remove('user-agent');
  assert.deepStrictEqual(actual?.getMap(), expected?.getMap() ?? {});
}
