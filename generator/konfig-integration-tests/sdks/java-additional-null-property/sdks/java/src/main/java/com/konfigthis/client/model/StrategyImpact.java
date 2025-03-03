/*
 * SnapTrade
 * Connect brokerage accounts to your app for live positions and trading
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: api@snaptrade.com
 *
 * NOTE: This class is auto generated by Konfig (https://konfigthis.com).
 * Do not edit the class manually.
 */


package com.konfigthis.client.model;

import java.util.Objects;
import java.util.Arrays;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.konfigthis.client.model.StrategyImpactLegsInner;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.konfigthis.client.JSON;

/**
 * The strategy impact
 */
@ApiModel(description = "The strategy impact")@javax.annotation.Generated(value = "Generated by https://konfigthis.com")
public class StrategyImpact {
  public static final String SERIALIZED_NAME_ESTIMATED_COMMISSIONS = "estimatedCommissions";
  @SerializedName(SERIALIZED_NAME_ESTIMATED_COMMISSIONS)
  private Double estimatedCommissions;

  public static final String SERIALIZED_NAME_BUYING_POWER_EFFECT = "buyingPowerEffect";
  @SerializedName(SERIALIZED_NAME_BUYING_POWER_EFFECT)
  private Double buyingPowerEffect;

  public static final String SERIALIZED_NAME_BUYING_POWER_RESULT = "buyingPowerResult";
  @SerializedName(SERIALIZED_NAME_BUYING_POWER_RESULT)
  private Double buyingPowerResult;

  public static final String SERIALIZED_NAME_MAINT_EXCESS_EFFECT = "maintExcessEffect";
  @SerializedName(SERIALIZED_NAME_MAINT_EXCESS_EFFECT)
  private Double maintExcessEffect;

  public static final String SERIALIZED_NAME_MAINT_EXCESS_RESULT = "maintExcessResult";
  @SerializedName(SERIALIZED_NAME_MAINT_EXCESS_RESULT)
  private Double maintExcessResult;

  public static final String SERIALIZED_NAME_TRADE_VALUE_CALCULATION = "tradeValueCalculation";
  @SerializedName(SERIALIZED_NAME_TRADE_VALUE_CALCULATION)
  private String tradeValueCalculation;

  public static final String SERIALIZED_NAME_LEGS = "legs";
  @SerializedName(SERIALIZED_NAME_LEGS)
  private List<StrategyImpactLegsInner> legs = null;

  public static final String SERIALIZED_NAME_SIDE = "side";
  @SerializedName(SERIALIZED_NAME_SIDE)
  private String side;

  public static final String SERIALIZED_NAME_EFFECT = "effect";
  @SerializedName(SERIALIZED_NAME_EFFECT)
  private String effect;

  public static final String SERIALIZED_NAME_PRICE = "price";
  @SerializedName(SERIALIZED_NAME_PRICE)
  private Double price;

  public static final String SERIALIZED_NAME_STRATEGY = "strategy";
  @SerializedName(SERIALIZED_NAME_STRATEGY)
  private String strategy;

  public StrategyImpact() {
  }

  public StrategyImpact estimatedCommissions(Double estimatedCommissions) {
    
    
    
    
    this.estimatedCommissions = estimatedCommissions;
    return this;
  }

  public StrategyImpact estimatedCommissions(Integer estimatedCommissions) {
    
    
    
    
    this.estimatedCommissions = estimatedCommissions.doubleValue();
    return this;
  }

   /**
   * Get estimatedCommissions
   * @return estimatedCommissions
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "11.95", value = "")

  public Double getEstimatedCommissions() {
    return estimatedCommissions;
  }


  public void setEstimatedCommissions(Double estimatedCommissions) {
    
    
    
    this.estimatedCommissions = estimatedCommissions;
  }


  public StrategyImpact buyingPowerEffect(Double buyingPowerEffect) {
    
    
    
    
    this.buyingPowerEffect = buyingPowerEffect;
    return this;
  }

  public StrategyImpact buyingPowerEffect(Integer buyingPowerEffect) {
    
    
    
    
    this.buyingPowerEffect = buyingPowerEffect.doubleValue();
    return this;
  }

   /**
   * Get buyingPowerEffect
   * @return buyingPowerEffect
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "-156.3435", value = "")

  public Double getBuyingPowerEffect() {
    return buyingPowerEffect;
  }


  public void setBuyingPowerEffect(Double buyingPowerEffect) {
    
    
    
    this.buyingPowerEffect = buyingPowerEffect;
  }


  public StrategyImpact buyingPowerResult(Double buyingPowerResult) {
    
    
    
    
    this.buyingPowerResult = buyingPowerResult;
    return this;
  }

  public StrategyImpact buyingPowerResult(Integer buyingPowerResult) {
    
    
    
    
    this.buyingPowerResult = buyingPowerResult.doubleValue();
    return this;
  }

   /**
   * Get buyingPowerResult
   * @return buyingPowerResult
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "8800.0882", value = "")

  public Double getBuyingPowerResult() {
    return buyingPowerResult;
  }


  public void setBuyingPowerResult(Double buyingPowerResult) {
    
    
    
    this.buyingPowerResult = buyingPowerResult;
  }


  public StrategyImpact maintExcessEffect(Double maintExcessEffect) {
    
    
    
    
    this.maintExcessEffect = maintExcessEffect;
    return this;
  }

  public StrategyImpact maintExcessEffect(Integer maintExcessEffect) {
    
    
    
    
    this.maintExcessEffect = maintExcessEffect.doubleValue();
    return this;
  }

   /**
   * Get maintExcessEffect
   * @return maintExcessEffect
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "-46.95", value = "")

  public Double getMaintExcessEffect() {
    return maintExcessEffect;
  }


  public void setMaintExcessEffect(Double maintExcessEffect) {
    
    
    
    this.maintExcessEffect = maintExcessEffect;
  }


  public StrategyImpact maintExcessResult(Double maintExcessResult) {
    
    
    
    
    this.maintExcessResult = maintExcessResult;
    return this;
  }

  public StrategyImpact maintExcessResult(Integer maintExcessResult) {
    
    
    
    
    this.maintExcessResult = maintExcessResult.doubleValue();
    return this;
  }

   /**
   * Get maintExcessResult
   * @return maintExcessResult
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "2642.669129", value = "")

  public Double getMaintExcessResult() {
    return maintExcessResult;
  }


  public void setMaintExcessResult(Double maintExcessResult) {
    
    
    
    this.maintExcessResult = maintExcessResult;
  }


  public StrategyImpact tradeValueCalculation(String tradeValueCalculation) {
    
    
    
    
    this.tradeValueCalculation = tradeValueCalculation;
    return this;
  }

   /**
   * Get tradeValueCalculation
   * @return tradeValueCalculation
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "1 x 0.07 x 100 + 1 x 0.28 x 100 = DR 35.00 CAD", value = "")

  public String getTradeValueCalculation() {
    return tradeValueCalculation;
  }


  public void setTradeValueCalculation(String tradeValueCalculation) {
    
    
    
    this.tradeValueCalculation = tradeValueCalculation;
  }


  public StrategyImpact legs(List<StrategyImpactLegsInner> legs) {
    
    
    
    
    this.legs = legs;
    return this;
  }

  public StrategyImpact addLegsItem(StrategyImpactLegsInner legsItem) {
    if (this.legs == null) {
      this.legs = new ArrayList<>();
    }
    this.legs.add(legsItem);
    return this;
  }

   /**
   * Get legs
   * @return legs
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public List<StrategyImpactLegsInner> getLegs() {
    return legs;
  }


  public void setLegs(List<StrategyImpactLegsInner> legs) {
    
    
    
    this.legs = legs;
  }


  public StrategyImpact side(String side) {
    
    
    
    
    this.side = side;
    return this;
  }

   /**
   * Get side
   * @return side
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Buy", value = "")

  public String getSide() {
    return side;
  }


  public void setSide(String side) {
    
    
    
    this.side = side;
  }


  public StrategyImpact effect(String effect) {
    
    
    
    
    this.effect = effect;
    return this;
  }

   /**
   * Get effect
   * @return effect
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Debit", value = "")

  public String getEffect() {
    return effect;
  }


  public void setEffect(String effect) {
    
    
    
    this.effect = effect;
  }


  public StrategyImpact price(Double price) {
    
    
    
    
    this.price = price;
    return this;
  }

  public StrategyImpact price(Integer price) {
    
    
    
    
    this.price = price.doubleValue();
    return this;
  }

   /**
   * Get price
   * @return price
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "0.35", value = "")

  public Double getPrice() {
    return price;
  }


  public void setPrice(Double price) {
    
    
    
    this.price = price;
  }


  public StrategyImpact strategy(String strategy) {
    
    
    
    
    this.strategy = strategy;
    return this;
  }

   /**
   * Get strategy
   * @return strategy
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "Strangle", value = "")

  public String getStrategy() {
    return strategy;
  }


  public void setStrategy(String strategy) {
    
    
    
    this.strategy = strategy;
  }

  /**
   * A container for additional, undeclared properties.
   * This is a holder for any undeclared properties as specified with
   * the 'additionalProperties' keyword in the OAS document.
   */
  private Map<String, Object> additionalProperties;

  /**
   * Set the additional (undeclared) property with the specified name and value.
   * If the property does not already exist, create it otherwise replace it.
   *
   * @param key name of the property
   * @param value value of the property
   * @return the StrategyImpact instance itself
   */
  public StrategyImpact putAdditionalProperty(String key, Object value) {
    if (this.additionalProperties == null) {
        this.additionalProperties = new HashMap<String, Object>();
    }
    this.additionalProperties.put(key, value);
    return this;
  }

  /**
   * Return the additional (undeclared) property.
   *
   * @return a map of objects
   */
  public Map<String, Object> getAdditionalProperties() {
    return additionalProperties;
  }

  /**
   * Return the additional (undeclared) property with the specified name.
   *
   * @param key name of the property
   * @return an object
   */
  public Object getAdditionalProperty(String key) {
    if (this.additionalProperties == null) {
        return null;
    }
    return this.additionalProperties.get(key);
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    StrategyImpact strategyImpact = (StrategyImpact) o;
    return Objects.equals(this.estimatedCommissions, strategyImpact.estimatedCommissions) &&
        Objects.equals(this.buyingPowerEffect, strategyImpact.buyingPowerEffect) &&
        Objects.equals(this.buyingPowerResult, strategyImpact.buyingPowerResult) &&
        Objects.equals(this.maintExcessEffect, strategyImpact.maintExcessEffect) &&
        Objects.equals(this.maintExcessResult, strategyImpact.maintExcessResult) &&
        Objects.equals(this.tradeValueCalculation, strategyImpact.tradeValueCalculation) &&
        Objects.equals(this.legs, strategyImpact.legs) &&
        Objects.equals(this.side, strategyImpact.side) &&
        Objects.equals(this.effect, strategyImpact.effect) &&
        Objects.equals(this.price, strategyImpact.price) &&
        Objects.equals(this.strategy, strategyImpact.strategy)&&
        Objects.equals(this.additionalProperties, strategyImpact.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash(estimatedCommissions, buyingPowerEffect, buyingPowerResult, maintExcessEffect, maintExcessResult, tradeValueCalculation, legs, side, effect, price, strategy, additionalProperties);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class StrategyImpact {\n");
    sb.append("    estimatedCommissions: ").append(toIndentedString(estimatedCommissions)).append("\n");
    sb.append("    buyingPowerEffect: ").append(toIndentedString(buyingPowerEffect)).append("\n");
    sb.append("    buyingPowerResult: ").append(toIndentedString(buyingPowerResult)).append("\n");
    sb.append("    maintExcessEffect: ").append(toIndentedString(maintExcessEffect)).append("\n");
    sb.append("    maintExcessResult: ").append(toIndentedString(maintExcessResult)).append("\n");
    sb.append("    tradeValueCalculation: ").append(toIndentedString(tradeValueCalculation)).append("\n");
    sb.append("    legs: ").append(toIndentedString(legs)).append("\n");
    sb.append("    side: ").append(toIndentedString(side)).append("\n");
    sb.append("    effect: ").append(toIndentedString(effect)).append("\n");
    sb.append("    price: ").append(toIndentedString(price)).append("\n");
    sb.append("    strategy: ").append(toIndentedString(strategy)).append("\n");
    sb.append("    additionalProperties: ").append(toIndentedString(additionalProperties)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }


  public static HashSet<String> openapiFields;
  public static HashSet<String> openapiRequiredFields;

  static {
    // a set of all properties/fields (JSON key names)
    openapiFields = new HashSet<String>();
    openapiFields.add("estimatedCommissions");
    openapiFields.add("buyingPowerEffect");
    openapiFields.add("buyingPowerResult");
    openapiFields.add("maintExcessEffect");
    openapiFields.add("maintExcessResult");
    openapiFields.add("tradeValueCalculation");
    openapiFields.add("legs");
    openapiFields.add("side");
    openapiFields.add("effect");
    openapiFields.add("price");
    openapiFields.add("strategy");

    // a set of required properties/fields (JSON key names)
    openapiRequiredFields = new HashSet<String>();
  }

 /**
  * Validates the JSON Object and throws an exception if issues found
  *
  * @param jsonObj JSON Object
  * @throws IOException if the JSON Object is invalid with respect to StrategyImpact
  */
  public static void validateJsonObject(JsonObject jsonObj) throws IOException {
      if (jsonObj == null) {
        if (!StrategyImpact.openapiRequiredFields.isEmpty()) { // has required fields but JSON object is null
          throw new IllegalArgumentException(String.format("The required field(s) %s in StrategyImpact is not found in the empty JSON string", StrategyImpact.openapiRequiredFields.toString()));
        }
      }
      if ((jsonObj.get("tradeValueCalculation") != null && !jsonObj.get("tradeValueCalculation").isJsonNull()) && !jsonObj.get("tradeValueCalculation").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `tradeValueCalculation` to be a primitive type in the JSON string but got `%s`", jsonObj.get("tradeValueCalculation").toString()));
      }
      if (jsonObj.get("legs") != null && !jsonObj.get("legs").isJsonNull()) {
        JsonArray jsonArraylegs = jsonObj.getAsJsonArray("legs");
        if (jsonArraylegs != null) {
          // ensure the json data is an array
          if (!jsonObj.get("legs").isJsonArray()) {
            throw new IllegalArgumentException(String.format("Expected the field `legs` to be an array in the JSON string but got `%s`", jsonObj.get("legs").toString()));
          }

          // validate the optional field `legs` (array)
          for (int i = 0; i < jsonArraylegs.size(); i++) {
            StrategyImpactLegsInner.validateJsonObject(jsonArraylegs.get(i).getAsJsonObject());
          };
        }
      }
      if ((jsonObj.get("side") != null && !jsonObj.get("side").isJsonNull()) && !jsonObj.get("side").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `side` to be a primitive type in the JSON string but got `%s`", jsonObj.get("side").toString()));
      }
      if ((jsonObj.get("effect") != null && !jsonObj.get("effect").isJsonNull()) && !jsonObj.get("effect").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `effect` to be a primitive type in the JSON string but got `%s`", jsonObj.get("effect").toString()));
      }
      if ((jsonObj.get("strategy") != null && !jsonObj.get("strategy").isJsonNull()) && !jsonObj.get("strategy").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `strategy` to be a primitive type in the JSON string but got `%s`", jsonObj.get("strategy").toString()));
      }
  }

  public static class CustomTypeAdapterFactory implements TypeAdapterFactory {
    @SuppressWarnings("unchecked")
    @Override
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
       if (!StrategyImpact.class.isAssignableFrom(type.getRawType())) {
         return null; // this class only serializes 'StrategyImpact' and its subtypes
       }
       final TypeAdapter<JsonElement> elementAdapter = gson.getAdapter(JsonElement.class);
       final TypeAdapter<StrategyImpact> thisAdapter
                        = gson.getDelegateAdapter(this, TypeToken.get(StrategyImpact.class));

       return (TypeAdapter<T>) new TypeAdapter<StrategyImpact>() {
           @Override
           public void write(JsonWriter out, StrategyImpact value) throws IOException {
             JsonObject obj = thisAdapter.toJsonTree(value).getAsJsonObject();
             obj.remove("additionalProperties");
             // serialize additonal properties
             if (value.getAdditionalProperties() != null) {
               for (Map.Entry<String, Object> entry : value.getAdditionalProperties().entrySet()) {
                 if (entry.getValue() instanceof String)
                   obj.addProperty(entry.getKey(), (String) entry.getValue());
                 else if (entry.getValue() instanceof Number)
                   obj.addProperty(entry.getKey(), (Number) entry.getValue());
                 else if (entry.getValue() instanceof Boolean)
                   obj.addProperty(entry.getKey(), (Boolean) entry.getValue());
                 else if (entry.getValue() instanceof Character)
                   obj.addProperty(entry.getKey(), (Character) entry.getValue());
                 else if (entry.getValue() == null) {
                   obj.addProperty(entry.getKey(), (String) null);
                 } else {
                   obj.add(entry.getKey(), gson.toJsonTree(entry.getValue()).getAsJsonObject());
                 }
               }
             }
             elementAdapter.write(out, obj);
           }

           @Override
           public StrategyImpact read(JsonReader in) throws IOException {
             JsonObject jsonObj = elementAdapter.read(in).getAsJsonObject();
             validateJsonObject(jsonObj);
             // store additional fields in the deserialized instance
             StrategyImpact instance = thisAdapter.fromJsonTree(jsonObj);
             for (Map.Entry<String, JsonElement> entry : jsonObj.entrySet()) {
               if (!openapiFields.contains(entry.getKey())) {
                 if (entry.getValue().isJsonPrimitive()) { // primitive type
                   if (entry.getValue().getAsJsonPrimitive().isString())
                     instance.putAdditionalProperty(entry.getKey(), entry.getValue().getAsString());
                   else if (entry.getValue().getAsJsonPrimitive().isNumber())
                     instance.putAdditionalProperty(entry.getKey(), entry.getValue().getAsNumber());
                   else if (entry.getValue().getAsJsonPrimitive().isBoolean())
                     instance.putAdditionalProperty(entry.getKey(), entry.getValue().getAsBoolean());
                   else
                     throw new IllegalArgumentException(String.format("The field `%s` has unknown primitive type. Value: %s", entry.getKey(), entry.getValue().toString()));
                 } else if (entry.getValue().isJsonArray()) {
                     instance.putAdditionalProperty(entry.getKey(), gson.fromJson(entry.getValue(), List.class));
                 } else { // JSON object
                     instance.putAdditionalProperty(entry.getKey(), gson.fromJson(entry.getValue(), HashMap.class));
                 }
               }
             }
             return instance;
           }

       }.nullSafe();
    }
  }

 /**
  * Create an instance of StrategyImpact given an JSON string
  *
  * @param jsonString JSON string
  * @return An instance of StrategyImpact
  * @throws IOException if the JSON string is invalid with respect to StrategyImpact
  */
  public static StrategyImpact fromJson(String jsonString) throws IOException {
    return JSON.getGson().fromJson(jsonString, StrategyImpact.class);
  }

 /**
  * Convert an instance of StrategyImpact to an JSON string
  *
  * @return JSON string
  */
  public String toJson() {
    return JSON.getGson().toJson(this);
  }
}

