# coding: utf-8

"""
    python-pydantic-list-in-union API

    A simple API based for testing python-pydantic-list-in-union.

    The version of the OpenAPI document: 1.0.0
    Contact: support@example.com
    Created by: http://example.com/support
"""

from datetime import datetime, date
import typing
from enum import Enum
from typing_extensions import TypedDict, Literal, TYPE_CHECKING
from pydantic import BaseModel, Field, RootModel, ConfigDict


class Obj(BaseModel):
    value: typing.Optional[str] = Field(None, alias='value')

    model_config = ConfigDict(
        protected_namespaces=(),
        arbitrary_types_allowed=True
    )
